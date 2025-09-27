const cache = require('../utils/cache');

describe('Cache', () => {
  beforeEach(() => {
    cache.clear();
  });

  afterEach(() => {
    cache.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };
      
      cache.set(key, value);
      const result = cache.get(key);
      
      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', () => {
      const result = cache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return null for expired key', (done) => {
      const key = 'expired-key';
      const value = { data: 'test-data' };
      
      cache.set(key, value, 0.1); // 100ms TTL
      
      setTimeout(() => {
        const result = cache.get(key);
        expect(result).toBeNull();
        done();
      }, 150);
    });

    it('should return value before expiration', () => {
      const key = 'valid-key';
      const value = { data: 'test-data' };
      
      cache.set(key, value, 1); // 1 second TTL
      const result = cache.get(key);
      
      expect(result).toEqual(value);
    });
  });

  describe('delete', () => {
    it('should delete a key', () => {
      const key = 'delete-key';
      const value = { data: 'test-data' };
      
      cache.set(key, value);
      expect(cache.get(key)).toEqual(value);
      
      cache.delete(key);
      expect(cache.get(key)).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      expect(cache.size()).toBe(2);
      
      cache.clear();
      
      expect(cache.size()).toBe(0);
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('size', () => {
    it('should return correct size', () => {
      expect(cache.size()).toBe(0);
      
      cache.set('key1', 'value1');
      expect(cache.size()).toBe(1);
      
      cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', (done) => {
      cache.set('expired1', 'value1', 0.1);
      cache.set('expired2', 'value2', 0.1);
      cache.set('valid', 'value3', 1);
      
      expect(cache.size()).toBe(3);
      
      setTimeout(() => {
        cache.cleanup();
        
        expect(cache.size()).toBe(1);
        expect(cache.get('valid')).toBe('value3');
        done();
      }, 150);
    });
  });
});

