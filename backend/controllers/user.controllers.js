import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment"

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {

   try {

      const userId = req.userId

      const user = await User.findById(userId)
         .select("-password")

      if (!user) {
         return res.status(400).json({
            message: "user not found"
         })
      }

      return res.status(200).json(user)

   } catch (error) {

      return res.status(400).json({
         message: "get current user error"
      })
   }
}

// UPDATE ASSISTANT
export const updateAssistant = async (req, res) => {

   try {

      const { assistantName, imageUrl } = req.body

      let assistantImage

      if (req.file) {

         assistantImage = await uploadOnCloudinary(req.file.path)

      } else {

         assistantImage = imageUrl
      }

      const user = await User.findByIdAndUpdate(
         req.userId,
         {
            assistantName,
            assistantImage
         },
         { new: true }
      ).select("-password")

      return res.status(200).json(user)

   } catch (error) {

      return res.status(400).json({
         message: "update assistant error"
      })
   }
}

// ASK TO ASSISTANT
export const askToAssistant = async (req, res) => {

   try {

      const { command } = req.body

      const user = await User.findById(req.userId)

      if (!user) {
         return res.status(404).json({
            response: "User not found"
         })
      }

      // SAVE HISTORY
      user.history.push(command)

      await user.save()

      const userName = user.name

      const assistantName = user.assistantName

      // AI RESPONSE
      const gemResult = await geminiResponse(
         command,
         assistantName,
         userName
      )

      console.log("FINAL AI RESULT:", gemResult)

      if (!gemResult) {

         return res.status(500).json({
            response: "No AI response"
         })
      }

      const type = gemResult.type

      switch (type) {

         case "get-date":

            return res.json({
               type,
               userInput: gemResult.userInput,
               response: `Current date is ${moment().format("YYYY-MM-DD")}`
            })

         case "get-time":

            return res.json({
               type,
               userInput: gemResult.userInput,
               response: `Current time is ${moment().format("hh:mm A")}`
            })

         case "get-day":

            return res.json({
               type,
               userInput: gemResult.userInput,
               response: `Today is ${moment().format("dddd")}`
            })

         case "get-month":

            return res.json({
               type,
               userInput: gemResult.userInput,
               response: `Current month is ${moment().format("MMMM")}`
            })

         case "google-search":
         case "youtube-search":
         case "youtube-play":
         case "general":
         case "calculator-open":
         case "instagram-open":
         case "facebook-open":
         case "weather-show":

            return res.json({
               type,
               userInput: gemResult.userInput,
               response: gemResult.response
            })

         default:

            return res.status(400).json({
               response: "I didn't understand that command."
            })
      }

   } catch (error) {

      console.log("ASK ASSISTANT ERROR:", error)

      return res.status(500).json({
         response: "ask assistant error"
      })
   }
}