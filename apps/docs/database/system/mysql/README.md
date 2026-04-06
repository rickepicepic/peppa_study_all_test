- **基础篇**:point_down:
  
	- [执行一条 SQL 查询语句，期间发生了什么？](/database/system/mysql/base/how_select)
	- [MySQL 一行记录是怎么存储的？](/database/system/mysql/base/row_format)
   
- **索引篇** :point_down:
  
	- [索引常见面试题](/database/system/mysql/index/index_interview)
	- [从数据页的角度看 B+ 树](/database/system/mysql/index/page)
	- [为什么 MySQL 采用 B+ 树作为索引？](/database/system/mysql/index/why_index_chose_bpuls_tree)
	- [MySQL 单表不要超过 2000W 行，靠谱吗？](/database/system/mysql/index/2000w)
	- [索引失效有哪些？](/database/system/mysql/index/index_lose)
	- [MySQL 使用 like“%x“，索引一定会失效吗？](/database/system/mysql/index/index_issue)
	- [count(\*) 和 count(1) 有什么区别？哪个性能最好？](/database/system/mysql/index/count)
   
- **事务篇** :point_down:
	- [事务隔离级别是怎么实现的？](/database/system/mysql/transaction/mvcc)
	- [MySQL 可重复读隔离级别，完全解决幻读了吗？](/database/system/mysql/transaction/phantom)
	
- **锁篇** :point_down:
	- [MySQL 有哪些锁？](/database/system/mysql/lock/mysql_lock)
	- [MySQL 是怎么加锁的？](/database/system/mysql/lock/how_to_lock)
	- [update 没加索引会锁全表？](/database/system/mysql/lock/update_index)
	- [MySQL 记录锁 + 间隙锁可以防止删除操作而导致的幻读吗？](/database/system/mysql/lock/lock_phantom)
	- [MySQL 死锁了，怎么办？](/database/system/mysql/lock/deadlock)
	- [字节面试：加了什么锁，导致死锁的？](/database/system/mysql/lock/show_lock)
	
- **日志篇** :point_down:
	
	- [undo log、redo log、binlog 有什么用？](/database/system/mysql/log/how_update)
	
- **内存篇** :point_down:
	
	- [揭开 Buffer_Pool 的面纱](/database/system/mysql/buffer_pool/buffer_pool)
	
	----
