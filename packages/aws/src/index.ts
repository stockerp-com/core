import { CloudFront } from './cloudfront/index.js';
import { S3 } from './s3/index.js';

class AWS {
  s3: S3;
  cloudFront: CloudFront;

  constructor() {
    this.cloudFront = new CloudFront();
    this.s3 = new S3({ cloudFront: this.cloudFront });
  }
}

export { AWS };
