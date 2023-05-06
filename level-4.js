let moveBlocksInterval;

const addBlockLevel4 = (grid) => {

    ballSpeed = 40;
  
    for (let i = 0; i < 24; i++) {
  
      const row = Math.floor(i / 6);
      const col = i % 6;
  
      const block = document.createElement("div");
    
    //   const blockHard2 = document.createElement("div");
  
      if(row===0 && col==0)
        block.classList.add("block-hard-2");
      
      else if(row===0 && col===5)
        block.classList.add("block-hard-2");
  
      else if(row===3 && col==0)
        block.classList.add("block-hard-2");

      else if(row===3 && col===5)
        block.classList.add("block-hard-2");
    
      else if(row===0 && col===3)
        block.classList.add("block-hard-1");
  
      else if(row===3 && col===2)
        block.classList.add("block-hard-1");
  
      else
         block.classList.add("block");
  
      block.style.left = `${20+col*100 + col*12}px`
      block.style.top = `${5+row*20 + row*12}px`
  
      grid.appendChild(block);
  
      // return; 
    }
    overlay.style.display = "none";

    

     // Check if game is not paused and overlay is not displayed before moving the blocks
  //    const moveBlocksInterval = setInterval(() => {
  //     // if (!paused && overlay.style.display === "none")
  //     if(parseInt(timerElement.innerText)%5==0) {
  //         const allBlocks = document.querySelectorAll(".block, .block-hard-1, .block-hard-2");
  //         allBlocks.forEach((block) => {
  //             const currentTop = parseInt(block.style.top);
  //             block.style.top = `${currentTop + 10}px`;
  //         });
  //     }
  // }, 5000);

    moveBlocksInterval = setInterval(() => {
        if (!paused && overlay.style.display === "none") {
            const allBlocks = document.querySelectorAll(".block, .block-hard-1, .block-hard-2");
            allBlocks.forEach((block) => {
                const currentTop = parseInt(block.style.top);
                block.style.top = `${currentTop + 10}px`;
            });
        }
    }, 5000);
  

// Call this function to start the interval initially
// startMoveBlocksInterval();

    
      
}
  