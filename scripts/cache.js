#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync, unlinkSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { createHash } from 'crypto';
import { logger } from './utils.js';

/**
 * Intelligent caching system for build artifacts and dependency checks
 */

/**
 * File-based cache manager with TTL and dependency tracking
 */
export class CacheManager {
  constructor(cacheDir = '.cache/scripts') {
    this.cacheDir = cacheDir;
    this.ensureCacheDir();
  }

  /**
   * Ensure cache directory exists
   * @private
   */
  ensureCacheDir() {
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
      logger.debug(`Created cache directory: ${this.cacheDir}`);
    }
  }

  /**
   * Generate cache key from input data
   * @param {string} namespace - Cache namespace
   * @param {any} data - Data to hash
   * @returns {string} Cache key
   */
  generateKey(namespace, data) {
    const hash = createHash('sha256');
    hash.update(JSON.stringify(data));
    return `${namespace}_${hash.digest('hex').substring(0, 16)}`;
  }

  /**
   * Get cached value
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in milliseconds
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key, ttl = 3600000) { // Default 1 hour TTL
    const cachePath = join(this.cacheDir, `${key}.json`);
    
    if (!existsSync(cachePath)) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    try {
      const stats = statSync(cachePath);
      const age = Date.now() - stats.mtime.getTime();
      
      if (age > ttl) {
        logger.debug(`Cache expired: ${key} (age: ${Math.round(age / 1000)}s)`);
        return null;
      }

      const cached = JSON.parse(readFileSync(cachePath, 'utf8'));
      logger.debug(`Cache hit: ${key}`);
      return cached.data;
    } catch (error) {
      logger.debug(`Cache read error: ${key} - ${error.message}`);
      return null;
    }
  }

  /**
   * Set cached value
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {Object} metadata - Additional metadata
   */
  set(key, data, metadata = {}) {
    const cachePath = join(this.cacheDir, `${key}.json`);
    
    try {
      const cacheData = {
        data,
        metadata: {
          ...metadata,
          timestamp: Date.now(),
          key
        }
      };

      writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
      logger.debug(`Cache set: ${key}`);
    } catch (error) {
      logger.debug(`Cache write error: ${key} - ${error.message}`);
    }
  }

  /**
   * Check if cache key exists and is valid
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in milliseconds
   * @returns {boolean} True if cache is valid
   */
  has(key, ttl = 3600000) {
    return this.get(key, ttl) !== null;
  }

  /**
   * Clear specific cache entry
   * @param {string} key - Cache key to clear
   */
  clear(key) {
    const cachePath = join(this.cacheDir, `${key}.json`);
    if (existsSync(cachePath)) {
      try {
        unlinkSync(cachePath);
        logger.debug(`Cache cleared: ${key}`);
      } catch (error) {
        logger.debug(`Cache clear error: ${key} - ${error.message}`);
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clearAll() {
    try {
      const files = readdirSync(this.cacheDir);

      for (const file of files) {
        if (file.endsWith('.json')) {
          unlinkSync(join(this.cacheDir, file));
        }
      }

      logger.info(`Cleared ${files.length} cache entries`);
    } catch (error) {
      logger.debug(`Cache clear all error: ${error.message}`);
    }
  }
}

/**
 * Dependency tracker for intelligent cache invalidation
 */
export class DependencyTracker {
  constructor(cacheManager) {
    this.cache = cacheManager;
  }

  /**
   * Get file modification times for dependency tracking
   * @param {Array} filePaths - Array of file paths to track
   * @returns {Object} Map of file paths to modification times
   */
  getFileMtimes(filePaths) {
    const mtimes = {};
    
    for (const filePath of filePaths) {
      if (existsSync(filePath)) {
        try {
          const stats = statSync(filePath);
          mtimes[filePath] = stats.mtime.getTime();
        } catch (error) {
          logger.debug(`Error getting mtime for ${filePath}: ${error.message}`);
          mtimes[filePath] = 0;
        }
      } else {
        mtimes[filePath] = 0;
      }
    }
    
    return mtimes;
  }

  /**
   * Check if dependencies have changed
   * @param {string} cacheKey - Cache key to check
   * @param {Array} dependencies - Array of file paths
   * @returns {boolean} True if dependencies have changed
   */
  dependenciesChanged(cacheKey, dependencies) {
    const currentMtimes = this.getFileMtimes(dependencies);
    const cachedMtimes = this.cache.get(`deps_${cacheKey}`);
    
    if (!cachedMtimes) {
      return true;
    }

    for (const [filePath, currentMtime] of Object.entries(currentMtimes)) {
      if (cachedMtimes[filePath] !== currentMtime) {
        logger.debug(`Dependency changed: ${filePath}`);
        return true;
      }
    }

    return false;
  }

  /**
   * Update dependency tracking for a cache key
   * @param {string} cacheKey - Cache key
   * @param {Array} dependencies - Array of file paths
   */
  updateDependencies(cacheKey, dependencies) {
    const mtimes = this.getFileMtimes(dependencies);
    this.cache.set(`deps_${cacheKey}`, mtimes);
  }
}

/**
 * Build cache utilities for common build operations
 */
export class BuildCache {
  constructor(cacheDir = '.cache/build') {
    this.cache = new CacheManager(cacheDir);
    this.deps = new DependencyTracker(this.cache);
  }

  /**
   * Check if build is needed based on source files
   * @param {string} target - Target identifier
   * @param {Array} sourceFiles - Source files to check
   * @param {Array} outputFiles - Output files to check
   * @returns {boolean} True if build is needed
   */
  needsBuild(target, sourceFiles = [], outputFiles = []) {
    const cacheKey = this.cache.generateKey('build', { target, sourceFiles, outputFiles });
    
    // Check if output files exist
    for (const outputFile of outputFiles) {
      if (!existsSync(outputFile)) {
        logger.debug(`Build needed: output file missing - ${outputFile}`);
        return true;
      }
    }

    // Check if dependencies changed
    if (this.deps.dependenciesChanged(cacheKey, sourceFiles)) {
      logger.debug(`Build needed: dependencies changed for ${target}`);
      return true;
    }

    logger.debug(`Build not needed: ${target} is up to date`);
    return false;
  }

  /**
   * Mark build as completed
   * @param {string} target - Target identifier
   * @param {Array} sourceFiles - Source files
   * @param {Array} outputFiles - Output files
   * @param {Object} metadata - Build metadata
   */
  markBuilt(target, sourceFiles = [], outputFiles = [], metadata = {}) {
    const cacheKey = this.cache.generateKey('build', { target, sourceFiles, outputFiles });
    
    this.cache.set(cacheKey, {
      target,
      timestamp: Date.now(),
      ...metadata
    });
    
    this.deps.updateDependencies(cacheKey, sourceFiles);
    logger.debug(`Build marked complete: ${target}`);
  }
}

// Export singleton instances
export const globalCache = new CacheManager();
export const buildCache = new BuildCache();

/**
 * Cached function wrapper
 * @param {Function} fn - Function to cache
 * @param {string} namespace - Cache namespace
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Function} Cached function
 */
export function cached(fn, namespace, ttl = 3600000) {
  return async function(...args) {
    const key = globalCache.generateKey(namespace, args);
    
    let result = globalCache.get(key, ttl);
    if (result !== null) {
      return result;
    }

    result = await fn.apply(this, args);
    globalCache.set(key, result);
    return result;
  };
}
