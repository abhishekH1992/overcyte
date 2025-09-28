/**
 * Performance monitoring utilities
 */

// React component performance monitoring
export function measureComponentRender(componentName: string) {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 16) { // More than one frame (60fps)
      console.warn(`[SLOW RENDER] ${componentName}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  };
}

// Function execution time monitoring
export function measureFunction<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 10) { // More than 10ms
      console.warn(`[SLOW FUNCTION] ${name}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
}

// Memory usage monitoring
export function logMemoryUsage(label: string) {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log(`[MEMORY] ${label}:`, {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
    });
  }
}

// Query performance monitoring
export function measureQuery<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
  const startTime = performance.now();
  
  return queryFn().then(result => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 50) { // More than 50ms
      console.warn(`[SLOW QUERY] ${queryName}: ${duration.toFixed(2)}ms`);
    } else {
      console.log(`[QUERY] ${queryName}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  });
}
