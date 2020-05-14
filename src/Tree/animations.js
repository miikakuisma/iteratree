import posed from 'react-pose'

export const SidebarContainer = posed.div({
  hidden: {
    right: () => -375,
    transition: {
      right: () => ({ type: 'spring', stiffness: 200, damping: 20 }),
    }
  },
  visible: {
    right: () => 0,
    transition: {
      right: () => ({ type: 'spring', stiffness: 200, damping: 20 })
    }
  },
});
