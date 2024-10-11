const notificationsArray = [];
 
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
 
        
        notificationsArray.push(data.message);
 
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('feedback').innerText = 'Erro ao enviar notificação!';
    });
});
 
document.getElementById('receiveButton').addEventListener('click', function() {
    fetchNotifications();
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
            try {
                const notification = JSON.parse(data);
                if (notification.message) {
                    notificationsArray.push(notification.message);
                    displayNotifications(notificationsArray);
                } else {
                    console.warn('Formato de notificação inesperado ou mensagem inválida:', notification);
                }
            } catch (error) {
                console.error('Erro ao analisar a notificação:', error);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar notificações: ', error);
        });
}
 
function displayNotifications(notifications) {
    const notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = '';
 
    if (notifications.length > 0) {
        notifications.forEach(notification => {
            const notificationDiv = document.createElement('div');
            notificationDiv.textContent = notification;
            notificationDiv.classList.add('notification');
            notificationList.appendChild(notificationDiv);
        });
    } else {
        const noNotificationsDiv = document.createElement('div');
        noNotificationsDiv.textContent = 'Nenhuma notificação disponível.';
        notificationList.appendChild(noNotificationsDiv);
    }
}