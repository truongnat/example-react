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
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           default: updated_at
     *           enum: [name, updated_at, created_at]
     *         description: Field to sort by
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           default: desc
     *           enum: [asc, desc]
     *         description: Sort order
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
     * /api/chat/rooms/{id}:
     *   put:
     *     summary: Update a chat room
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
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 minLength: 1
     *                 maxLength: 100
     *                 description: Room name
     *               avatarUrl:
     *                 type: string
     *                 format: uri
     *                 description: Room avatar URL
     *     responses:
     *       200:
     *         description: Room updated successfully
     *       400:
     *         description: Invalid input
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Access denied (only room author can update)
     *       404:
     *         description: Room not found
     *       409:
     *         description: Room with this name already exists
     */
    this.router.put(
      '/rooms/:id',
      [
        param('id').isUUID().withMessage('Invalid room ID'),
        body('name')
          .optional()
          .isString()
          .isLength({ min: 1, max: 100 })
          .withMessage('Room name must be between 1 and 100 characters'),
        body('avatarUrl')
          .optional()
          .isURL()
          .withMessage('Avatar URL must be a valid URL'),
      ],
      this.chatController.updateRoom.bind(this.chatController)
    );

    /**
     * @swagger
     * /api/chat/rooms/{id}:
     *   delete:
     *     summary: Delete a chat room
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
     *         description: Room deleted successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Access denied (only room author can delete)
     *       404:
     *         description: Room not found
     */
    this.router.delete(
      '/rooms/:id',
      [param('id').isUUID().withMessage('Invalid room ID')],
      this.chatController.deleteRoom.bind(this.chatController)
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

    /**
     * @swagger
     * /api/chat/rooms/{id}/invite:
     *   post:
     *     summary: Invite users to a chat room
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
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - userIds
     *             properties:
     *               userIds:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: uuid
     *                 description: Array of user IDs to invite
     *                 minItems: 1
     *                 maxItems: 50
     *     responses:
     *       200:
     *         description: Users invited successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: object
     *                   properties:
     *                     invitedUsers:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           id:
     *                             type: string
     *                           username:
     *                             type: string
     *                           email:
     *                             type: string
     *                     alreadyMembers:
     *                       type: array
     *                       items:
     *                         type: string
     *                     notFound:
     *                       type: array
     *                       items:
     *                         type: string
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid request data
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Only room author can invite users
     *       404:
     *         description: Room not found
     */
    this.router.post(
      '/rooms/:id/invite',
      [
        param('id').isUUID().withMessage('Invalid room ID'),
        body('userIds')
          .isArray({ min: 1, max: 50 })
          .withMessage('userIds must be an array with 1-50 items'),
        body('userIds.*')
          .isUUID()
          .withMessage('Each user ID must be a valid UUID'),
      ],
      this.chatController.inviteUsers.bind(this.chatController)
    );

    /**
     * @swagger
     * /api/chat/rooms/{roomId}/members:
     *   get:
     *     summary: Get members of a chat room
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
     *     responses:
     *       200:
     *         description: Room members retrieved successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Access denied
     *       404:
     *         description: Room not found
     */
    this.router.get(
      '/rooms/:roomId/members',
      [param('roomId').isUUID().withMessage('Invalid room ID')],
      this.chatController.getRoomMembers.bind(this.chatController)
    );

    /**
     * @swagger
     * /api/chat/rooms/{roomId}/members/{memberId}:
     *   delete:
     *     summary: Remove a member from a chat room
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
     *         name: memberId
     *         required: true
     *         schema:
     *           type: string
     *         description: Member ID to remove
     *     responses:
     *       200:
     *         description: Member removed successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Access denied (only room author can remove members)
     *       404:
     *         description: Room or member not found
     */
    this.router.delete(
      '/rooms/:roomId/members/:memberId',
      [
        param('roomId').isUUID().withMessage('Invalid room ID'),
        param('memberId').isUUID().withMessage('Invalid member ID')
      ],
      this.chatController.removeMember.bind(this.chatController)
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
