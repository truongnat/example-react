import { Router } from 'express';
import { body, param } from 'express-validator';
import { ChatController } from '@presentation/controllers/ChatController';
import { AuthMiddleware } from '@infrastructure/middleware/AuthMiddleware';

export class ChatRoutes {
  private router: Router;

  constructor(
    private readonly chatController: ChatController,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Apply authentication middleware to all chat routes
    this.router.use(this.authMiddleware.authenticate);

    // Room routes
    this.setupRoomRoutes();
    
    // Message routes
    this.setupMessageRoutes();
  }

  private setupRoomRoutes(): void {
    /**
     * @swagger
     * /api/chat/rooms:
     *   get:
     *     summary: Get all chat rooms for the authenticated user
     *     tags: [Chat]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Number of rooms per page
     *     responses:
     *       200:
     *         description: Rooms retrieved successfully
     *       401:
     *         description: Unauthorized
     */
    this.router.get('/rooms', this.chatController.getRooms.bind(this.chatController));

    /**
     * @swagger
     * /api/chat/rooms:
     *   post:
     *     summary: Create a new chat room
     *     tags: [Chat]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *                 description: Room name
     *               avatarUrl:
     *                 type: string
     *                 description: Room avatar URL
     *     responses:
     *       201:
     *         description: Room created successfully
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     *       409:
     *         description: Room with this name already exists
     */
    this.router.post(
      '/rooms',
      [
        body('name')
          .isString()
          .isLength({ min: 1, max: 100 })
          .withMessage('Room name must be between 1 and 100 characters'),
        body('avatarUrl')
          .optional()
          .isURL()
          .withMessage('Avatar URL must be a valid URL'),
      ],
      this.chatController.createRoom.bind(this.chatController)
    );

    /**
     * @swagger
     * /api/chat/rooms/{id}:
     *   get:
     *     summary: Get a specific chat room
     *     tags: [Chat]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *     responses:
     *       200:
     *         description: Room retrieved successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Access denied
     *       404:
     *         description: Room not found
     */
    this.router.get(
      '/rooms/:id',
      [param('id').isUUID().withMessage('Invalid room ID')],
      this.chatController.getRoom.bind(this.chatController)
    );

    /**
     * @swagger
     * /api/chat/rooms/{id}/join:
     *   post:
     *     summary: Join a chat room
     *     tags: [Chat]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *     responses:
     *       200:
     *         description: Joined room successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Room not found
     */
    this.router.post(
      '/rooms/:id/join',
      [param('id').isUUID().withMessage('Invalid room ID')],
      this.chatController.joinRoom.bind(this.chatController)
    );

    /**
     * @swagger
     * /api/chat/rooms/{id}/leave:
     *   post:
     *     summary: Leave a chat room
     *     tags: [Chat]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *     responses:
     *       200:
     *         description: Left room successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Room not found
     */
    this.router.post(
      '/rooms/:id/leave',
      [param('id').isUUID().withMessage('Invalid room ID')],
      this.chatController.leaveRoom.bind(this.chatController)
    );
  }

  private setupMessageRoutes(): void {
    /**
     * @swagger
     * /api/chat/rooms/{roomId}/messages:
     *   get:
     *     summary: Get messages for a chat room
     *     tags: [Chat]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: roomId
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 50
     *         description: Number of messages per page
     *     responses:
     *       200:
     *         description: Messages retrieved successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Access denied
     *       404:
     *         description: Room not found
     */
    this.router.get(
      '/rooms/:roomId/messages',
      [param('roomId').isUUID().withMessage('Invalid room ID')],
      this.chatController.getMessages.bind(this.chatController)
    );

    // Note: Message creation is handled via WebSocket (send-message event)
    // These REST endpoints are mainly for message management (edit/delete)

    /**
     * @swagger
     * /api/chat/rooms/{roomId}/messages/{messageId}:
     *   put:
     *     summary: Update a message (edit)
     *     tags: [Chat]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: roomId
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *       - in: path
     *         name: messageId
     *         required: true
     *         schema:
     *           type: string
     *         description: Message ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - content
     *             properties:
     *               content:
     *                 type: string
     *                 description: Updated message content
     *     responses:
     *       200:
     *         description: Message updated successfully
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Access denied
     *       404:
     *         description: Message not found
     */
    this.router.put(
      '/rooms/:roomId/messages/:messageId',
      [
        param('roomId').isUUID().withMessage('Invalid room ID'),
        param('messageId').isUUID().withMessage('Invalid message ID'),
        body('content')
          .isString()
          .isLength({ min: 1, max: 2000 })
          .withMessage('Message content must be between 1 and 2000 characters'),
      ],
      this.chatController.updateMessage.bind(this.chatController)
    );

    /**
     * @swagger
     * /api/chat/rooms/{roomId}/messages/{messageId}:
     *   delete:
     *     summary: Delete a message
     *     tags: [Chat]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: roomId
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *       - in: path
     *         name: messageId
     *         required: true
     *         schema:
     *           type: string
     *         description: Message ID
     *     responses:
     *       200:
     *         description: Message deleted successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Access denied
     *       404:
     *         description: Message not found
     */
    this.router.delete(
      '/rooms/:roomId/messages/:messageId',
      [
        param('roomId').isUUID().withMessage('Invalid room ID'),
        param('messageId').isUUID().withMessage('Invalid message ID'),
      ],
      this.chatController.deleteMessage.bind(this.chatController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
