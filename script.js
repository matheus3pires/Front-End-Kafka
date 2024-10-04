document.getElementById('notificationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;
    const priorityLevel = parseInt(document.getElementById('priority').value); 

    
    const notification = {
        message: message,
        priorityLevel: priorityLevel 
    };

    
    fetch('http://localhost:8080/producer/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
    })
    .then(response => {
        console.log('Resposta do servidor:', response);
        return response.json(); 
    })
    .then(data => {
        console.log(data);
        document.getElementById('feedback').innerText = data.message; 
        document.getElementById('notificationForm').reset(); 

        
        fetchNotifications(); 
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('feedback').innerText = 'Erro ao enviar notificação!';
    });
});

function fetchNotifications() {
    fetch('http://localhost:8081/api/notification')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar notificações');
            }
            return response.text(); 
        })
        .then(data => {
            displayNotifications([data]); 
        })
        .catch(error => {
            console.error('Erro ao buscar notificações: ', error);
        });
}


function displayNotifications(notifications) {
    const notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = '';

    notifications.forEach(notification => {
        const notificationDiv = document.createElement('div');
        notificationDiv.textContent = notification; 
        notificationDiv.classList.add('notification'); 
        notificationList.appendChild(notificationDiv);
    });
}
