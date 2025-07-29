import React, { useEffect, useState, useCallback } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { initializeWebSocket, getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } from "../../services/Api";
import "./NotificationButton.css"; // Vamos a crear este archivo

const NotificationButton = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Cargar notificaciones desde la base de datos
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const [notificationData, unreadCountData] = await Promise.all([
                getNotifications(),
                getUnreadNotificationCount()
            ]);
            
            setNotifications(notificationData);
            setUnreadCount(unreadCountData);
            console.log("📋 Loaded notifications:", notificationData.length, "Unread:", unreadCountData);
        } catch (error) {
            console.error("Error loading notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Manejar nuevos mensajes de WebSocket
    const handleWebSocketMessage = useCallback((message) => {
        console.log("🔔 New WebSocket notification:", message);
        
        // Crear objeto de notificación temporal para mostrar inmediatamente
        const newNotification = {
            id: Date.now(), // ID temporal
            message: message,
            read: false,
            timestamp: new Date().toISOString()
        };
        
        // Agregar a la lista y actualizar contador
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Recargar desde la base de datos después de un momento para sincronizar
        setTimeout(() => {
            loadNotifications();
        }, 1000);
    }, [loadNotifications]);

    // Marcar una notificación como leída
    const handleMarkAsRead = async (notification) => {
        if (notification.read || !notification.id || notification.id === Date.now()) {
            return; // Ya está leída o es temporal
        }

        try {
            await markNotificationAsRead(notification.id);
            
            // Actualizar estado local
            setNotifications(prev => 
                prev.map(n => 
                    n.id === notification.id ? { ...n, read: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            
            console.log("✅ Notification marked as read:", notification.id);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Marcar todas como leídas
    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            
            // Actualizar estado local
            setNotifications(prev => 
                prev.map(n => ({ ...n, read: true }))
            );
            setUnreadCount(0);
            
            console.log("✅ All notifications marked as read");
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    // Inicializar WebSocket y cargar notificaciones
    useEffect(() => {
        loadNotifications();
        initializeWebSocket(handleWebSocketMessage);
    }, [loadNotifications, handleWebSocketMessage]);

    // Formatear tiempo relativo
    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return "";
        
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
        
        if (diffInMinutes < 1) return "Ahora";
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
        return `${Math.floor(diffInMinutes / 1440)}d`;
    };

    return (
        <Dropdown show={isOpen} onToggle={setIsOpen} className="notification-dropdown">
            <Dropdown.Toggle 
                variant="outline-light" 
                id="dropdown-notifications"
                className="notification-toggle position-relative"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    className="bi bi-bell-fill"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                </svg>
                
                {/* Badge de contador mejorado */}
                {unreadCount > 0 && (
                    <Badge 
                        bg="danger" 
                        pill 
                        className="position-absolute notification-badge"
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu className="notification-menu" align="end">
                <div className="notification-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">🔔 Notificaciones</h6>
                        {unreadCount > 0 && (
                            <Button 
                                variant="link" 
                                size="sm" 
                                className="mark-all-read-btn"
                                onClick={handleMarkAllAsRead}
                            >
                                Marcar todas como leídas
                            </Button>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <small className="text-muted mt-1 d-block">
                            Tienes {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
                        </small>
                    )}
                </div>

                <div className="notification-list">
                    {loading ? (
                        <div className="notification-loading">
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <span>Cargando notificaciones...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                fill="currentColor"
                                className="bi bi-bell-slash mb-3 opacity-50"
                                viewBox="0 0 16 16"
                            >
                                <path d="M5.164 14H15c-1.5-1-2-5.902-2-7 0-.264-.02-.523-.06-.776L5.164 14zm6.288-10.617A4.988 4.988 0 0 0 8.995 1.1a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 .898-.335 4.342-1.278 6.113l9.73-2.73zM10 16a2 2 0 1 1-4 0h4zM0 2.5L15 .5l.5 15L0 17.5 0 2.5z"/>
                            </svg>
                            <p className="mb-0">No tienes notificaciones</p>
                            <small className="text-muted">Te notificaremos cuando tengas algo nuevo</small>
                        </div>
                    ) : (
                        notifications.map((notification, index) => (
                            <Dropdown.Item 
                                key={notification.id || index}
                                className={`notification-item ${!notification.read ? 'unread' : 'read'}`}
                                onClick={() => handleMarkAsRead(notification)}
                            >
                                <div className="d-flex align-items-start">
                                    <div className="flex-grow-1">
                                        <div className="notification-message">
                                            {notification.message}
                                        </div>
                                        <small className="notification-time d-block">
                                            {formatTimeAgo(notification.timestamp)}
                                        </small>
                                    </div>
                                    {!notification.read && (
                                        <div className="notification-dot"></div>
                                    )}
                                </div>
                            </Dropdown.Item>
                        ))
                    )}
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationButton;