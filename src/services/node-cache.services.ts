import NodeCache from "node-cache";
import { getEnvVar } from "../utils/common.utils";

export class NodeCacheService {
  private nodeCache: NodeCache;

  constructor() {
    this.nodeCache = new NodeCache({ stdTTL: Number(getEnvVar('NODE_CACHE_EXPIRY')), checkperiod: Number(getEnvVar('NODE_CACHE_CHECK_PERIOD')) });
  }

  setNodeCacheData(
    key: string,
    value: string | Buffer | number,
    expiresIn: number | null = null,
  ) {
    if (expiresIn) return this.nodeCache.set(key, value, expiresIn);

    return this.nodeCache.set(key, value);
  }

  getNodeCacheData(key: string) {
    return this.nodeCache.get(key);
  }

  deleteNodeCacheData(key: string) {
    return this.nodeCache.del(key);
  }
}