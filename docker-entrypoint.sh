#!/bin/bash
cat > app/config.constant.ts << EOF1
export const CONFIG = {
  authUrl: '$AUTH_ADDR',
  cmsUrl: '$WEBAPI_ADDR'
};
EOF1
npm run serve