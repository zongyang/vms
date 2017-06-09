var limits = {};
limits.img = {
    mimes: ['image/jpeg', 'image/gif', 'image/png'],
    size: 10 * 1024 * 1024,
    sizeInfo:'图片文件大小不能超过10MB',
    mimesInfo:'请选择jpeg、gif、png的图片文件'
}
limits.video = {
    mimes: ['video/x-msvideo', 'video/x-dv', 'video/mp4', 'video/mpeg', 'video/mpeg', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/x-matroska'],
    size: 1024 * 1024 * 1024,
    sizeInfo:'视频文件大小不能超过1GB',
    mimesInfo:'请选择视频文件'
}

module.exports = limits;
