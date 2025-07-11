# Error Handling Fix - Server Crash Issue

## 🚨 **Vấn đề phát hiện**

Server bị crash khi có lỗi `ForbiddenException` từ ChatController:

```
ForbiddenException: Access denied to this room
    at GetRoomUseCase.execute (GetRoomUseCase.ts:18:13)
    at async ChatController.getRoom (ChatController.ts:92:22)
[nodemon] app crashed - waiting for file changes before starting...
```

### **Root Cause:**
- **Controllers** đang sử dụng `throw error` thay vì `next(error)`
- **Express error middleware** chỉ hoạt động khi error được pass qua `next(error)`
- **Unhandled exception** khiến toàn bộ server crash

## ✅ **Giải pháp đã thực hiện**

### **1. ChatController.ts** - Sửa tất cả methods:

#### **Trước:**
```typescript
public async getRoom(req: Request, res: Response): Promise<void> {
  try {
    // ... logic
  } catch (error) {
    throw error; // ❌ Gây crash server
  }
}
```

#### **Sau:**
```typescript
public async getRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // ... logic
  } catch (error) {
    next(error); // ✅ Pass error to middleware
  }
}
```

### **2. ValidationMiddleware.ts** - Sửa error handling:

#### **Trước:**
```typescript
if (!errors.isEmpty()) {
  const errorMessages = errors.array().map(error => error.msg);
  throw new ValidationException('Validation failed', errorMessages); // ❌ Throw
}
```

#### **Sau:**
```typescript
if (!errors.isEmpty()) {
  const errorMessages = errors.array().map(error => error.msg);
  const validationError = new ValidationException('Validation failed', errorMessages);
  return next(validationError); // ✅ Pass to middleware
}
```

### **3. Các controllers khác:**
- ✅ **AuthController** - Đã đúng từ đầu (sử dụng `next(error)`)
- ✅ **TodoController** - Đã đúng từ đầu (sử dụng `next(error)`)

## 🔧 **Error Middleware Flow**

### **Cách hoạt động:**
1. **Controller** catch error → `next(error)`
2. **ErrorMiddleware.handle()** nhận error
3. **Check error type** (BaseException, ValidationError, JWT, etc.)
4. **Return appropriate HTTP response** với status code đúng
5. **Server continues running** 🎯

### **ErrorMiddleware.ts** xử lý:
```typescript
// Custom exceptions (ForbiddenException, NotFoundException, etc.)
if (error instanceof BaseException) {
  const response: ApiResponse = {
    success: false,
    message: error.message,
    errors: error.errors
  };
  res.status(error.statusCode).json(response); // 403, 404, etc.
  return;
}

// JWT errors
if (error.name === 'JsonWebTokenError') {
  res.status(401).json({ success: false, message: 'Authentication failed' });
  return;
}

// Generic errors
res.status(500).json({ success: false, message: 'Internal server error' });
```

## 🚀 **Kết quả**

### **Trước khi sửa:**
- ❌ Server crash khi có lỗi 403 Forbidden
- ❌ Tất cả API endpoints ngừng hoạt động
- ❌ Cần restart server manually

### **Sau khi sửa:**
- ✅ Server không crash
- ✅ Error được handle gracefully
- ✅ Client nhận response JSON với status code đúng:

```json
{
  "success": false,
  "message": "Access denied to this room",
  "errors": undefined
}
```

- ✅ Các API khác vẫn hoạt động bình thường

## 📝 **Best Practices**

### **Express Error Handling:**
1. **Always use `next(error)`** trong async controllers
2. **Never use `throw error`** trong Express middleware/controllers
3. **Setup global error middleware** để catch tất cả errors
4. **Use custom exception classes** với proper status codes

### **Error Response Format:**
```typescript
interface ApiResponse {
  success: boolean;
  data?: any;
  message: string;
  errors?: string[];
}
```

### **Custom Exception Hierarchy:**
```typescript
BaseException (abstract)
├── ValidationException (400)
├── UnauthorizedException (401)  
├── ForbiddenException (403)
├── NotFoundException (404)
├── ConflictException (409)
└── InternalServerException (500)
```

## 🔍 **Testing**

Để test error handling:
```bash
# Test 403 Forbidden
curl -X GET /api/chat/rooms/invalid-room-id \
  -H "Authorization: Bearer <token>"

# Expected: 403 response, server không crash
{
  "success": false,
  "message": "Access denied to this room"
}
```

Giờ đây server sẽ handle errors một cách graceful và không bao giờ crash do unhandled exceptions! 🎯
