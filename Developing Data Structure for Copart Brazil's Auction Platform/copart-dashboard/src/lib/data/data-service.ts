// ============================================================================
// Copart Brasil — Data Service
// Abstract layer: swap MockDataService for BigQueryDataService
// ============================================================================

import { MockDataService } from './mock-data';
import type { DataService } from './types';

// ┌──────────────────────────────────────────────────────────────────┐
// │  TO CONNECT TO BIGQUERY:                                         │
// │  1. Create BigQueryDataService implementing DataService          │
// │  2. Change the line below to: new BigQueryDataService()          │
// │  3. All UI components will automatically use live data           │
// └──────────────────────────────────────────────────────────────────┘

export const dataService: DataService = new MockDataService();
