Util.register("Visual",_=>{
  const v = {};
  const waitQ = {};
  v.wait = str=>Q.do(function*(){
    if(!waitQ[str])waitQ[str] = Q.emptyBox();
    return Q.takeBox(waitQ[str]);
  });
  v.emit = (str,data)=>Q.do(function*(){
    if(!waitQ[str])waitQ[str] = Q.emptyBox();
    return Q.putBox(waitQ[str],data);
  });
  Q.run(Q.do(function*(){
    const shape = Shape.rect(0,0,Util.width,Util.height);

    const x = Ease.out.cubic(20).begin(-1);
    
    yield Q.listen(Q.do(function*(){
      const d = yield v.wait("Switch");
      yield x.to(x.target()*-1);
    }));

    const render = _=>{
      R.fill(Color.rgb(1,0.5,0))(Shape.rect(0,0,Util.width,Util.height));
      R.fill(Color.rgb(1,1,1))(Shape.circle(Util.width/2+x()*200,Util.height/2,40));
    };
    const handler = box=>Q.do(function*(){
      yield Q.listen(Q.do(function*(){
        const b = yield box.receive;
        if(b.mouse)yield Logic.emit("Mouse",b.mouse);
      }));
      yield Q.abort;
    });

    const view = yield View.make(_=>({mouse:_}),shape,render,handler);
    Screen.register("Visual",view);
  }));

  return v;
});
