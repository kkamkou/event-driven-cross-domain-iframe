function MyBridgeChannel(urn, proxyUrl) {
  this.proxyUrl = proxyUrl;
  this.listener = $({});
  this.urn = urn;
}

MyBridgeChannel.prototype.createInstance = function () {
  var that = this;
  return new easyXDM.Rpc(
    {
      remote: this.urn,
      remoteHelper: this.proxyUrl + '/name.html',
      props: {
        className: 'my-iframe',
        style: {
          outline: 'none',
          top: 'auto',
          left: 'auto',
          position: 'static',
          display: 'none',
          padding: 0
        }
      },
      onReady: function () {
        alert('Channel ready');
      }
    },
    {
      local: {
        event: function (id, data, cbSuccess, cbError) {
          that.listener.trigger('event', [id, data, cbSuccess, cbError]);
          return {result: true};
        },
        close: function (cbSuccess, cbError) {
          that.listener.trigger('close', [cbSuccess, cbError]);
          return {result: true};
        },
        resize: function (w, h, cbSuccess, cbError) {
          that.listener.trigger('resize', [w, h, cbSuccess, cbError]);
          return {result: true};
        }
      }
    }
  );
};

MyBridgeChannel.prototype.on = function (id, cb) {
  this.listener.on(id, function () {
    cb.apply(this, Array.prototype.slice.call(arguments, 1));
  });
  return this;
};
