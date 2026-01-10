// API Helper with rate limit handling and exponential backoff

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

// Global request queue to ensure minimum time between API calls
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 500; // 500ms minimum between requests

/**
 * Wait for minimum interval before making next request
 */
async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Rate limit: waiting ${waitTime}ms before next request`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

/**
 * Fetch with automatic retry and exponential backoff for rate limits
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
  attempt = 1
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;
  
  // Wait for rate limit before making request
  await waitForRateLimit();

  try {
    const response = await fetch(url, fetchOptions);

    // For rate limits (429), don't retry - the window hasn't reset yet
    // Just return the error so caller knows to slow down
    if (response.status === 429) {
      console.error(`Rate limited on ${url}. Backend needs more time between requests.`);
      return response; // Return 429 without retry
    }

    return response;
  } catch (error) {
    // Network error - retry
    if (attempt <= retries) {
      const delay = retryDelay * Math.pow(2, attempt - 1);
      console.warn(`Network error. Retrying in ${delay}ms... (Attempt ${attempt}/${retries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }
    
    throw error;
  }
}

/**
 * Delay execution for throttling
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute async functions in batches with delays between batches
 */
export async function executeBatched<T>(
  tasks: (() => Promise<T>)[],
  batchSize: number = 3,
  delayBetweenBatches: number = 500
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(task => task()));
    results.push(...batchResults);
    
    // Delay between batches (except for the last batch)
    if (i + batchSize < tasks.length) {
      await delay(delayBetweenBatches);
    }
  }
  
  return results;
}

/**
 * Create a cached fetch function that stores results for a given time
 */
export function createCachedFetch(cacheDuration: number = 60000) {
  const cache = new Map<string, { data: any; timestamp: number }>();

  return async function cachedFetch(url: string, options?: FetchOptions): Promise<any> {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cached = cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data;
    }

    // Fetch new data
    const response = await fetchWithRetry(url, options);
    const data = await response.json();
    
    // Store in cache
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  };
}
