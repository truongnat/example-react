# Chat API Sorting Optimization

## 🔍 **Vấn đề phát hiện**

### **Trước khi sửa:**
- ❌ **Backend** đã sort theo `updated_at DESC` trong SQLiteRoomRepository
- ❌ **Chat API** không có sorting parameters (chỉ có `page`, `limit`)
- ❌ **Frontend** lại sort thêm lần nữa theo `lastActivity` 
- ❌ **Duplicate work**: Backend sort → Frontend sort lại
- ❌ **Inconsistent**: Todo API có full sorting support, Chat API thì không

### **Code cũ:**
```typescript
// Backend: SQLiteRoomRepository.ts (dòng 104)
ORDER BY r.updated_at DESC  // ✅ Đã sort rồi

// Frontend: ChatRoomList.tsx (dòng 121-125)  
const sortedRooms = [...filteredRooms].sort((a, b) => {
  const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
  const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
  return bTime - aTime;  // ❌ Sort lại không cần thiết
});
```

## ✅ **Giải pháp đã thực hiện**

### **1. Backend Changes**

#### **ChatRoutes.ts** - Thêm sorting parameters:
```typescript
// Thêm vào Swagger documentation:
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
```

#### **ChatController.ts** - Parse sorting parameters:
```typescript
const sortBy = (req.query.sortBy as string) || 'updated_at';
const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
const result = await this.getRoomsUseCase.execute({ page, limit, sortBy, sortOrder }, userId);
```

#### **SQLiteRoomRepository.ts** - Dynamic sorting với SQL injection protection:
```typescript
// Validate sortBy to prevent SQL injection
const allowedSortFields = ['name', 'updated_at', 'created_at'];
const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'updated_at';
const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

ORDER BY r.${safeSortBy} ${safeSortOrder}
```

### **2. Frontend Changes**

#### **ChatService.ts** - Hỗ trợ sorting parameters:
```typescript
async getRooms(
  page = 1, 
  limit = 10, 
  sortBy: 'name' | 'updated_at' | 'created_at' = 'updated_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<RoomsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  });
  
  const response = await httpClient.get<RoomsResponse>(
    `${this.baseUrl}/rooms?${params.toString()}`
  );
}
```

#### **useChat.ts** - Update hook signature:
```typescript
export function useRooms(
  page = 1, 
  limit = 10,
  sortBy: 'name' | 'updated_at' | 'created_at' = 'updated_at',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  return useQuery({
    queryKey: [...chatKeys.rooms(), page, limit, sortBy, sortOrder],
    queryFn: () => chatService.getRooms(page, limit, sortBy, sortOrder),
  });
}
```

#### **ChatRoomList.tsx** - Xóa client-side sorting:
```typescript
// ✅ Sử dụng API sorting
const { data: roomsData } = useRooms(1, 10, 'updated_at', 'desc');

// ❌ Xóa client-side sorting
// const sortedRooms = [...filteredRooms].sort((a, b) => { ... });

// ✅ Chỉ filter, không sort
const filteredRooms = rooms.filter(room =>
  room.name.toLowerCase().includes(searchQuery.toLowerCase())
);
```

## 🚀 **Lợi ích**

### **Performance:**
- ✅ **Giảm CPU usage** ở client (không cần sort)
- ✅ **Database sorting** hiệu quả hơn JavaScript sorting
- ✅ **Ít memory usage** (không tạo sorted array copy)

### **Consistency:**
- ✅ **Nhất quán** với Todo API (cùng có sorting support)
- ✅ **Single source of truth** cho sorting logic
- ✅ **Type safety** với TypeScript

### **Scalability:**
- ✅ **Database indexing** có thể optimize sorting
- ✅ **Pagination + Sorting** hoạt động đúng
- ✅ **SQL injection protection** với field validation

### **Maintainability:**
- ✅ **Ít code** ở frontend
- ✅ **Centralized sorting logic** ở backend
- ✅ **Easier testing** (chỉ test backend sorting)

## 🔧 **API Usage Examples**

```typescript
// Default: Sort by updated_at DESC
useRooms()

// Sort by name ASC
useRooms(1, 10, 'name', 'asc')

// Sort by created_at DESC
useRooms(1, 10, 'created_at', 'desc')
```

## 📝 **Next Steps**

Có thể mở rộng thêm:
- ✅ Search parameters (`?search=keyword`)
- ✅ Filter parameters (`?status=active`)
- ✅ Multiple sort fields (`?sortBy=updated_at,name`)

Giờ đây Chat API đã nhất quán với Todo API và không còn duplicate sorting logic!
