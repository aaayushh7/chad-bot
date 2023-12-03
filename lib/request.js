import ENV from '../config.env';

export async function getAllRooms(){
    let response;
    try {
        response = await fetch(`${ENV.BASE_URL}/room`);
    } catch(err) {
        throw new Error('Error fetching rooms');
    }
    if (!response.ok) throw new Error('Error fetching rooms');
    const { success, data } = await response.json();
    if(!success) throw new Error('Error fetching rooms');
    return data;
}

export async function getMessages(roomid){
    const response = await fetch(`${ENV.BASE_URL}/chat/${roomid}`);
    const { success, data } = await response.json();
    if(!success) throw new Error('Error fetching messages');
    return data;
}

export async function createRoom(){
    const response = await fetch(`${ENV.BASE_URL}/room`, {
        method : 'POST'        
    });
    const { success, data } = await response.json();
    if(!success) throw new Error('Error creating room');
    return data;
}

export async function deleteRoom(roomid){
    const response = await fetch(`${ENV.BASE_URL}/room/${roomid}`, {
        method : 'DELETE'        
    });
    const { success, data } = await response.json();
    if(!success) throw new Error('Error deleting room');
    return data;
}

export async function sendMessage({ roomid, message }){

    if(!roomid && !message) throw new Error("Invalid arguments");

    const response = await fetch(`${ENV.BASE_URL}/chat/${roomid}`, {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({ question : message })        
    });
    const { success, data } = await response.json();

    if(!success) throw new Error('Error sending message');
    return { success , data };
}
