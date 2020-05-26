import posed from 'react-pose'

export const QuestionBox = posed.div({
  hidden: {
    opacity: 0,
    y: (props) => -30,
    scale: () => 0.5,
    transition: {
      y: (props) => ({ type: 'spring', stiffness: 200, damping: 5 }),
      scale: (props) => ({ type: 'spring', stiffness: 200, damping: 5 })
    }
  },
  visible: {
    opacity: 1,
    scale: () => 1,
    y: (props) => 0,
    transition: {
      y: (props) => ({ type: 'spring', stiffness: 200, damping: 20 }),
      scale: (props) => ({ type: 'spring', stiffness: 200, damping: 20 })
    }
  },
});

export const ContentImage = posed.div({
  hidden: {
    y: -10,
    opacity: 0,
    scaleY: 0.9,
    scaleX: 0.9,
    transition: {
      y: (props) => ({ type: 'spring', stiffness: 10, damping: 5 })
    }
  },
  visible: {
    y: 0,
    opacity: 1,
    scaleY: 1,
    scaleX: 1,
    transition: {
      y: (props) => ({ type: 'spring', stiffness: 200, damping: 20 })
    }
  }
})

export const Button = posed.button({
  pressed: {
    scaleY: 0.9,
    scaleX: 0.9,
    transition: {
      y: (props) => ({ type: 'spring', stiffness: 200, damping: 20 })
    }
  },
  released: {
    scaleY: 1,
    scaleX: 1,
    transition: {
      y: (props) => ({ type: 'spring', stiffness: 200, damping: 20 })
    }
  }
});
