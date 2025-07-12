import { Message } from '@domain/entities/Message';

describe('Message Entity', () => {
  const mockMessageData = {
    content: 'This is a test message',
    authorId: 'author-123',
    roomId: 'room-456',
  };

  describe('create', () => {
    it('should create a new message with default values', () => {
      const message = Message.create(mockMessageData);

      expect(message.id).toBeDefined();
      expect(message.content).toBe(mockMessageData.content);
      expect(message.authorId).toBe(mockMessageData.authorId);
      expect(message.roomId).toBe(mockMessageData.roomId);
      expect(message.isDeleted).toBe(false);
      expect(message.createdAt).toBeInstanceOf(Date);
      expect(message.updatedAt).toBeInstanceOf(Date);
    });

    it('should create message with unique IDs', () => {
      const message1 = Message.create(mockMessageData);
      const message2 = Message.create(mockMessageData);

      expect(message1.id).not.toBe(message2.id);
    });
  });

  describe('fromPersistence', () => {
    it('should create message from persistence data', () => {
      const persistenceData = {
        id: 'message-123',
        content: 'Persisted message',
        authorId: 'author-123',
        roomId: 'room-456',
        isDeleted: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const message = Message.fromPersistence(persistenceData);

      expect(message.id).toBe(persistenceData.id);
      expect(message.content).toBe(persistenceData.content);
      expect(message.authorId).toBe(persistenceData.authorId);
      expect(message.roomId).toBe(persistenceData.roomId);
      expect(message.isDeleted).toBe(persistenceData.isDeleted);
      expect(message.createdAt).toEqual(persistenceData.createdAt);
      expect(message.updatedAt).toEqual(persistenceData.updatedAt);
    });
  });

  describe('business methods', () => {
    let message: Message;

    beforeEach(() => {
      message = Message.create(mockMessageData);
    });

    describe('updateContent', () => {
      it('should update content successfully', async () => {
        const newContent = 'Updated message content';
        const originalUpdatedAt = message.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 1));
        
        message.updateContent(newContent);

        expect(message.content).toBe(newContent);
        expect(message.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should throw error when trying to update deleted message', () => {
        message.delete();

        expect(() => message.updateContent('New content')).toThrow(
          'Cannot update deleted message'
        );
      });
    });

    describe('delete and restore', () => {
      it('should delete message', async () => {
        const originalUpdatedAt = message.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 10));

        message.delete();

        expect(message.isDeleted).toBe(true);
        expect(message.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should restore deleted message', async () => {
        message.delete();
        const deletedUpdatedAt = message.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 10));

        message.restore();

        expect(message.isDeleted).toBe(false);
        expect(message.updatedAt.getTime()).toBeGreaterThan(deletedUpdatedAt.getTime());
      });
    });

    describe('permission checks', () => {
      it('should correctly identify author', () => {
        expect(message.isAuthor(mockMessageData.authorId)).toBe(true);
        expect(message.isAuthor('other-user')).toBe(false);
      });

      it('should correctly check edit permissions', () => {
        expect(message.canBeEditedBy(mockMessageData.authorId)).toBe(true);
        expect(message.canBeEditedBy('other-user')).toBe(false);

        message.delete();
        expect(message.canBeEditedBy(mockMessageData.authorId)).toBe(false);
      });

      it('should correctly check delete permissions', () => {
        expect(message.canBeDeletedBy(mockMessageData.authorId)).toBe(true);
        expect(message.canBeDeletedBy('other-user')).toBe(false);

        message.delete();
        expect(message.canBeDeletedBy(mockMessageData.authorId)).toBe(false);
      });
    });

    describe('utility methods', () => {
      it('should correctly check visibility', () => {
        expect(message.isVisible()).toBe(true);

        message.delete();
        expect(message.isVisible()).toBe(false);

        message.restore();
        expect(message.isVisible()).toBe(true);
      });

      it('should correctly check room membership', () => {
        expect(message.belongsToRoom(mockMessageData.roomId)).toBe(true);
        expect(message.belongsToRoom('other-room')).toBe(false);
      });
    });
  });

  describe('JSON serialization', () => {
    let message: Message;

    beforeEach(() => {
      message = Message.create(mockMessageData);
    });

    describe('toJSON', () => {
      it('should return complete message data', () => {
        const json = message.toJSON();

        expect(json).toHaveProperty('id');
        expect(json).toHaveProperty('content');
        expect(json).toHaveProperty('authorId');
        expect(json).toHaveProperty('roomId');
        expect(json).toHaveProperty('isDeleted');
        expect(json).toHaveProperty('createdAt');
        expect(json).toHaveProperty('updatedAt');

        expect(json.content).toBe(mockMessageData.content);
        expect(json.authorId).toBe(mockMessageData.authorId);
        expect(json.roomId).toBe(mockMessageData.roomId);
        expect(json.isDeleted).toBe(false);
      });
    });

    describe('toPublicJSON', () => {
      it('should return public message data without isDeleted', () => {
        const publicJson = message.toPublicJSON();

        expect(publicJson).toHaveProperty('id');
        expect(publicJson).toHaveProperty('content');
        expect(publicJson).toHaveProperty('authorId');
        expect(publicJson).toHaveProperty('roomId');
        expect(publicJson).toHaveProperty('createdAt');
        expect(publicJson).toHaveProperty('updatedAt');
        
        // Should not have sensitive data
        expect(publicJson).not.toHaveProperty('isDeleted');

        expect(publicJson.content).toBe(mockMessageData.content);
        expect(publicJson.authorId).toBe(mockMessageData.authorId);
        expect(publicJson.roomId).toBe(mockMessageData.roomId);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty content', () => {
      const messageWithEmptyContent = Message.create({
        ...mockMessageData,
        content: '',
      });

      expect(messageWithEmptyContent.content).toBe('');
    });

    it('should handle very long content', () => {
      const longContent = 'a'.repeat(2000);
      const messageWithLongContent = Message.create({
        ...mockMessageData,
        content: longContent,
      });

      expect(messageWithLongContent.content).toBe(longContent);
    });

    it('should handle special characters in content', () => {
      const specialContent = 'Hello! 🎉 This is a test with émojis and spëcial chars: @#$%^&*()';
      const messageWithSpecialContent = Message.create({
        ...mockMessageData,
        content: specialContent,
      });

      expect(messageWithSpecialContent.content).toBe(specialContent);
    });

    it('should handle multiple delete/restore cycles', () => {
      const message = Message.create(mockMessageData);

      expect(message.isDeleted).toBe(false);

      message.delete();
      expect(message.isDeleted).toBe(true);

      message.restore();
      expect(message.isDeleted).toBe(false);

      message.delete();
      expect(message.isDeleted).toBe(true);

      message.restore();
      expect(message.isDeleted).toBe(false);
    });
  });
});
