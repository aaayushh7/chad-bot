import Message from '../models/message.model';
import Room from '../models/room.model'
import OpenAI from 'openai';
import ENV from '../config.env'

/** GET: http://localhost:3000/api/chat/roomid */
export async function getChat(req, res){
    try {
        
        const { roomid } = req.query;

        if(!roomid) return res.status(400).json({ error : "No room id present...!"});

        const messages = await Message.find({ room : roomid }, { __v: 0, room: 0})

        if(!messages) return res.status(400).json({ error : "No message found...!"});

        return res.status(200).json({ success : true, data: messages })

    } catch (error) {
        return res.status(400).json({ error });
    }
}

/** POST: http://localhost:3000/api/chat/roomid */
export async function createChat(req, res){
    const { roomid } = req.query;
    const { question, answer } = req.body;

    if(!roomid) return res.status(400).json({ error : "No room id present...!"});
    if (!question && !answer) return res.status(400).json({ error: "Cannot get data from the user...!" });

    /** get current room */
    const rooms = await Room.findOne({ _id : roomid })

    if(!rooms) return res.status(400).json({ error : "No room found...!"});

    /** CONFIG OPEN AI API */
    const openai = new OpenAI({
        apiKey: ENV.OPENAI_API_KEY // This is also the default, can be omitted
      });

    // const openai = new OpenAIApi(config);

    const completion = await openai.createCompletion({
        model : "text-davinci-003",
        prompt : question,
        temperature : 0.5, 
        max_tokens : 100,
        top_p : 1
    })
    //   try{
    //     const completion = await openai.ChatCompletion.create({
    //         model: "gpt-3.5-turbo",
    //         prompt: question,
    //         max_tokens: 30,
    //       });
    //   } catch(err) {
    //     console.error(err);
    //     return res.status(400).json({ error: "Error generating response" });
    // }
    const message = new Message({
        question,
        answer : completion.choices[0].text,
        room : roomid
    })

    //tried chat completion 
    // const openFun=async()=>{
    //     const chatCompletion = await openai.chat.completions.create({
    //         model: "gpt-3.5-turbo",
    //         messages: [{"role": "user", "content": "YOUR PROMPT TEXT",}],
    //         max_tokens:30
    //       });
    //       const ans = chatCompletion.choices[0].message.content;
    // }
    // openFun();
    
        

    /** specify data to the message model */
    

    /** save data in the database */
    await message.save();

    /** push message in the room model */
    rooms.messages.push(message._id);

    /** save data in the room model */
    await rooms.save()

    return res.status(200).json({ success : true, data: message })

}


/** DELETE: http://localhost:3000/api/chat/roomid */
/** So, This is the exercise for you */