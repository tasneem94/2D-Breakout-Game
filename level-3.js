const addBlockLevel3 = (grid) => {

    ballSpeed = 40;
  
    for (let i = 0; i < 24; i++) {
  
      const row = Math.floor(i / 6);
      const col = i % 6;
  
      const block = document.createElement("div");
    //   const blockHard1 = document.createElement("div");
    //   const blockHard2 = document.createElement("div");
  
      if(row===0 && col==0)
        block.classList.add("block-hard-1");
      
      else if(row===0 && col===5)
        block.classList.add("block-hard-2");
  
      else if(row===3 && col==0)
        block.classList.add("block-hard-2");

      else if(row===3 && col===5)
        block.classList.add("block-hard-1");
    
      else if(row===1 && col===3)
        block.classList.add("block-hard-1");
  
      else if(row===2 && col===2)
        block.classList.add("block-hard-2");
  
      else
         block.classList.add("block");
  
      block.style.left = `${20+col*100 + col*12}px`
      block.style.top = `${5+row*20 + row*12}px`
  
      grid.appendChild(block);
  
      // return;
    }
  }