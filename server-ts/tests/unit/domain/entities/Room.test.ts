import { Room } from '@domain/entities/Room';

describe('Room Entity', () => {
  const mockRoomData = {
    name: 'Test Room',
    avatarUrl: 'https://example.com/room-avatar.jpg',
    authorId: 'author-123',
  };

  describe('create', () => {
    it('should create a new room with default values', () => {
      const room = Room.create(mockRoomData);

      expect(room.id).toBeDefined();
      expect(room.name).toBe(mockRoomData.name);
      expect(room.avatarUrl).toBe(mockRoomData.avatarUrl);
      expect(room.authorId).toBe(mockRoomData.authorId);
      expect(room.lastMessageId).toBeUndefined();
      expect(room.participants).toEqual([mockRoomData.authorId]);
      expect(room.createdAt).toBeInstanceOf(Date);
      expect(room.updatedAt).toBeInstanceOf(Date);
    });

    it('should create room with empty avatar URL if not provided', () => {
      const roomDataWithoutAvatar = {
        name: mockRoomData.name,
        authorId: mockRoomData.authorId,
      };

      const room = Room.create(roomDataWithoutAvatar);

      expect(room.avatarUrl).toBe('');
    });

    it('should create room with unique IDs', () => {
      const room1 = Room.create(mockRoomData);
      const room2 = Room.create(mockRoomData);

      expect(room1.id).not.toBe(room2.id);
    });

    it('should automatically add author as participant', () => {
      const room = Room.create(mockRoomData);

      expect(room.participants).toContain(mockRoomData.authorId);
      expect(room.getParticipantCount()).toBe(1);
    });
  });

  describe('fromPersistence', () => {
    it('should create room from persistence data', () => {
      const persistenceData = {
        id: 'room-123',
        name: 'Persisted Room',
        avatarUrl: 'https://example.com/avatar.jpg',
        authorId: 'author-123',
        lastMessageId: 'message-123',
        participants: ['author-123', 'user-456'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const room = Room.fromPersistence(persistenceData);

      expect(room.id).toBe(persistenceData.id);
      expect(room.name).toBe(persistenceData.name);
      expect(room.avatarUrl).toBe(persistenceData.avatarUrl);
      expect(room.authorId).toBe(persistenceData.authorId);
      expect(room.lastMessageId).toBe(persistenceData.lastMessageId);
      expect(room.participants).toEqual(persistenceData.participants);
      expect(room.createdAt).toEqual(persistenceData.createdAt);
      expect(room.updatedAt).toEqual(persistenceData.updatedAt);
    });
  });

  describe('business methods', () => {
    let room: Room;

    beforeEach(() => {
      room = Room.create(mockRoomData);
    });

    describe('updateInfo', () => {
      it('should update name only', async () => {
        const newName = 'Updated Room Name';
        const originalAvatarUrl = room.avatarUrl;
        const originalUpdatedAt = room.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 10));
        
        room.updateInfo(newName);

        expect(room.name).toBe(newName);
        expect(room.avatarUrl).toBe(originalAvatarUrl);
        expect(room.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should update avatar URL only', async () => {
        const newAvatarUrl = 'https://example.com/new-avatar.jpg';
        const originalName = room.name;
        const originalUpdatedAt = room.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 1));
        
        room.updateInfo(undefined, newAvatarUrl);

        expect(room.name).toBe(originalName);
        expect(room.avatarUrl).toBe(newAvatarUrl);
        expect(room.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should update both name and avatar URL', async () => {
        const newName = 'Updated Room Name';
        const newAvatarUrl = 'https://example.com/new-avatar.jpg';
        const originalUpdatedAt = room.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 10));

        room.updateInfo(newName, newAvatarUrl);

        expect(room.name).toBe(newName);
        expect(room.avatarUrl).toBe(newAvatarUrl);
        expect(room.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should not update if no parameters provided', () => {
        const originalName = room.name;
        const originalAvatarUrl = room.avatarUrl;
        const originalUpdatedAt = room.updatedAt;

        room.updateInfo();

        expect(room.name).toBe(originalName);
        expect(room.avatarUrl).toBe(originalAvatarUrl);
        expect(room.updatedAt).toEqual(originalUpdatedAt);
      });
    });

    describe('participant management', () => {
      it('should add new participant', async () => {
        const newUserId = 'user-456';
        const originalUpdatedAt = room.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 10));

        room.addParticipant(newUserId);

        expect(room.participants).toContain(newUserId);
        expect(room.getParticipantCount()).toBe(2);
        expect(room.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should not add duplicate participant', () => {
        const originalCount = room.getParticipantCount();
        const originalUpdatedAt = room.updatedAt;

        room.addParticipant(mockRoomData.authorId); // Author is already a participant

        expect(room.getParticipantCount()).toBe(originalCount);
        expect(room.updatedAt).toEqual(originalUpdatedAt);
      });

      it('should remove participant', async () => {
        const newUserId = 'user-456';
        room.addParticipant(newUserId);

        const originalUpdatedAt = room.updatedAt;
        await new Promise(resolve => setTimeout(resolve, 10)); // Increase delay to ensure time difference

        room.removeParticipant(newUserId);

        expect(room.participants).not.toContain(newUserId);
        expect(room.getParticipantCount()).toBe(1);
        expect(room.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });

      it('should not remove non-existent participant', () => {
        const originalCount = room.getParticipantCount();
        const originalUpdatedAt = room.updatedAt;

        room.removeParticipant('non-existent-user');

        expect(room.getParticipantCount()).toBe(originalCount);
        expect(room.updatedAt).toEqual(originalUpdatedAt);
      });

      it('should throw error when trying to remove author', () => {
        expect(() => room.removeParticipant(mockRoomData.authorId)).toThrow(
          'Cannot remove room author from participants'
        );
      });

      it('should return copy of participants array', () => {
        const participants = room.participants;
        participants.push('new-user');

        expect(room.participants).not.toContain('new-user');
      });
    });

    describe('last message management', () => {
      it('should set last message', async () => {
        const messageId = 'message-123';
        const originalUpdatedAt = room.updatedAt;

        await new Promise(resolve => setTimeout(resolve, 10));

        room.setLastMessage(messageId);

        expect(room.lastMessageId).toBe(messageId);
        expect(room.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    describe('permission checks', () => {
      it('should correctly identify participants', () => {
        const newUserId = 'user-456';
        
        expect(room.isParticipant(mockRoomData.authorId)).toBe(true);
        expect(room.isParticipant(newUserId)).toBe(false);

        room.addParticipant(newUserId);
        expect(room.isParticipant(newUserId)).toBe(true);
      });

      it('should correctly identify author', () => {
        expect(room.isAuthor(mockRoomData.authorId)).toBe(true);
        expect(room.isAuthor('other-user')).toBe(false);
      });

      it('should correctly check user access', () => {
        const newUserId = 'user-456';
        
        expect(room.canUserAccess(mockRoomData.authorId)).toBe(true);
        expect(room.canUserAccess(newUserId)).toBe(false);

        room.addParticipant(newUserId);
        expect(room.canUserAccess(newUserId)).toBe(true);
      });

      it('should correctly check user modification rights', () => {
        const newUserId = 'user-456';
        room.addParticipant(newUserId);
        
        expect(room.canUserModify(mockRoomData.authorId)).toBe(true);
        expect(room.canUserModify(newUserId)).toBe(false);
      });
    });

    describe('utility methods', () => {
      it('should return correct participant count', () => {
        expect(room.getParticipantCount()).toBe(1);

        room.addParticipant('user-456');
        expect(room.getParticipantCount()).toBe(2);

        room.addParticipant('user-789');
        expect(room.getParticipantCount()).toBe(3);
      });
    });
  });

  describe('toJSON', () => {
    it('should return complete room data', () => {
      const room = Room.create(mockRoomData);
      const json = room.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('name');
      expect(json).toHaveProperty('avatarUrl');
      expect(json).toHaveProperty('authorId');
      expect(json).toHaveProperty('participants');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');

      expect(json.name).toBe(mockRoomData.name);
      expect(json.avatarUrl).toBe(mockRoomData.avatarUrl);
      expect(json.authorId).toBe(mockRoomData.authorId);
      expect(json.participants).toEqual([mockRoomData.authorId]);
    });
  });
});
