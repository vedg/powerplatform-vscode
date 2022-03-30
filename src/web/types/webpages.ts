/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */
import abstractentity from "./abstractentity";

export default interface webpage extends abstractentity {
  adx_customcss?: string;
  adx_title?: string;
  adx_websiteidname?: string;
  adx_websiteid: string;
  adx_customjavascript?: string;
  adx_summary?: string;
  adx_name: string;
  adx_copy?: string;
  adx_rootwebpageid?: string;
  adx_webpageid: string;
}
