const userModel = require("../models/userModel");
const transactionModel = require("../models/transactionModel");
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
module.exports.registerUser = async (req,res) => {
    const {name,email,password} = req.body;
  try {
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields"
        })
    }
    const userAllreadyExists = await userModel.findOne({email});
    if(userAllreadyExists){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
    }
    const user = await userModel.create({
        name,
        email,
        password,
    })
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET|| '12343dgd',{
        expiresIn:"30d"
    })
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:{
            name:user.name,
            email:user.email,
            password:user.password,
        },
        token:token
    })
     await user.save();

  } catch (error) {
    res.status(500).json({
        success:false,
        message:error.message,
    })
  }
}

module.exports.loginUser = async (req,res) => {
    const {email,password} = req.body;
    console.log('Request Body:', req.body); 
  try {
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields"
        })
    }
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User does not exists"
        })
    }
    const isPasswordMatched  = await user.comparePassword(password);
    if(!isPasswordMatched){
        return res.status(400).json({
            success:false,
            message:"Invalid password"
        })
    }
  if(isPasswordMatched){
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET|| '12343dgd',{
        expiresIn:"30d"
    })
    res.status(200).json({
        success:true,
        message:"User login successfully",
        token:token,
        user:{
            name:user.name,
        },
    })
  }
}
    catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
} 

module.exports.userCredits = async (req,res) => {
    try {
        const {userId} = req.body;
        const user =  await userModel.findById(userId);
     res.status(200).json({
            success:true,
            message:"User credits fetched successfully",
            credits:user.creditBalance,
            user:{name:user.name}
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports.paymentMethod = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    if (!userId || !planId) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Plan not found",
        });
    }

    const transaction = await transactionModel.create({
      userId,
      plan,
      amount,
      credits,
      payment: false,
      date: Date.now(),
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Purchase ${plan} Credits`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/buy?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/buy`,
      metadata: {
        transactionId: transaction._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      message: `Checkout session created for the ${plan} plan.`,
    });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const transactionId = session.metadata.transactionId;

      const transactionData = await transactionModel.findById(transactionId);
      if (!transactionData) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
      }
      if (transactionData.payment) {
        return res.status(400).json({
          success: false,
          message: "Payment already processed",
        });
      }
      const updatedUser = await userModel.findByIdAndUpdate(
        transactionData.userId,
        {
          $inc: { creditBalance: transactionData.credits },
        },
        { new: true } 
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      await transactionModel.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });

      res.status(200).json({
        success: true,
        message: "Payment verified and credits added successfully",
        creditBalance: updatedUser.creditBalance,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};