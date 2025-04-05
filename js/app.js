const DECISION_THESHOLD = 75;
let isAnimating = false;
// distancia que la card se esta arrastrando

function startDrag(event) {
  if (isAnimating) return;

  //get the first article element
  const actualCard = event.target.closest('article');
  if (!actualCard) return;

  // get initial position of mouse or finger}
  const startX = event.pageX ?? event.touches[0].pageX;

  // listen the mouse and tuch movements
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);

  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd, { passive: true });

  function onMove(event) {
    //current position of mouse or finger
    const currentX = event.pageX ?? event.touches[0].pageX;
    // distance between initial position and current position
    pullDeltaX = currentX - startX;
    // no hay distancia recorrida
    if (pullDeltaX === 0) return;
    // change the flag to indicate we are animating
    isAnimating = true;
    // calcultate the rotation of the card using the distance
    const deg = pullDeltaX / 13;
    // apply the transformation to the card
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
    // change the cursor to grabbing
    actualCard.style.cursor = 'grabbing';

    // change opacity of the choice info
    const opacity = Math.abs(pullDeltaX) / 100;
    const isRight = pullDeltaX > 0;

    const choiceEl = isRight
      ? actualCard.querySelector('.choise.like')
      : actualCard.querySelector('.choise.nope');

    choiceEl.style.opacity = opacity;
  }

  function onEnd(event) {
    // remove the listeners
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);

    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);

    // saber si el usuario tomo un desicion
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THESHOLD;

    if (decisionMade) {
      const goRight = pullDeltaX >= 0;
      const goLeft = !goRight;

      // add class acording to the decision
      actualCard.classList.add(goRight ? 'go-right' : 'go-left');
      actualCard.addEventListener('transitionend', () => {
        actualCard.remove();
      });
    } else {
      actualCard.classList.add('reset');
      actualCard.classList.remove('go-left', 'go-right');
    }

    // reset the variables
    actualCard.addEventListener('transitionend', () => {
      actualCard.removeAttribute('style');
      actualCard.classList.remove('reset');
      actualCard.querySelector('.choice').forEach((el) => {
        el.style.opacity = 0;
      });

      pullDeltaX = 0;
      isAnimating = false;
    });
  }
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, { passive: true });
