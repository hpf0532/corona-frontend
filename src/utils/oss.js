const OSS = require('ali-oss')

export function client(data) {
    //后端提供数据
    return new OSS({
        accessKeyId: data.Credentials.AccessKeyId,
        accessKeySecret: data.Credentials.AccessKeySecret,
        stsToken: data.Credentials.SecurityToken,
        region: data.region, // oss地区
        bucket: data.bucket
    })
}