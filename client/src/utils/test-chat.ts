// Test utility to check chat duplicate message issue
import { useChatStore } from '@/stores/chatStore'

export function testChatDuplicates() {
  const store = useChatStore.getState()
  
  console.log('=== Chat Duplicate Test ===')
  
  // Test 1: Add optimistic message
  console.log('Test 1: Adding optimistic message...')
  const tempId1 = store.addOptimisticMessage({
    content: 'Test message 1',
    roomId: 'test-room',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      username: 'testuser',
      avatarUrl: ''
    }
  })
  console.log('Temp ID 1:', tempId1)
  
  // Test 2: Try to add same optimistic message again (should be blocked)
  console.log('Test 2: Adding duplicate optimistic message...')
  const tempId2 = store.addOptimisticMessage({
    content: 'Test message 1',
    roomId: 'test-room',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      username: 'testuser',
      avatarUrl: ''
    }
  })
  console.log('Temp ID 2 (should be null):', tempId2)
  
  // Test 3: Add real message with same content (should replace optimistic)
  console.log('Test 3: Adding real message with same content...')
  store.addMessage({
    id: 'real-msg-1',
    content: 'Test message 1',
    roomId: 'test-room',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      username: 'testuser',
      avatarUrl: ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isOptimistic: false
  })
  
  // Check final state
  const messages = store.messagesByRoom['test-room'] || []
  console.log('Final messages count:', messages.length)
  console.log('Messages:', messages.map(m => ({ id: m.id, content: m.content, isOptimistic: m.isOptimistic })))
  
  // Test 4: Try to add same real message again (should be blocked)
  console.log('Test 4: Adding duplicate real message...')
  store.addMessage({
    id: 'real-msg-1',
    content: 'Test message 1',
    roomId: 'test-room',
    authorId: 'user-1',
    author: {
      id: 'user-1',
      username: 'testuser',
      avatarUrl: ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isOptimistic: false
  })
  
  const finalMessages = store.messagesByRoom['test-room'] || []
  console.log('Final messages count after duplicate:', finalMessages.length)
  console.log('Should still be 1 message')
  
  console.log('=== Test Complete ===')
}

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testChatDuplicates = testChatDuplicates
}
