import '@logseq/libs'
// import React from 'react'
// import ReactDOM from 'react-dom'
// import App from './App'
// import './index.css'

type IMenu = {
  menuName: string
  pathRegExp: string
  extensionName: string
  apps: {
    title: string
    openSchema: string
  }[]
}

const isDevelopment = import.meta.env.DEV

if (isDevelopment) {
  // renderApp('browser')
} else {
  console.log('=== logseq-plugin-open-in-external-app loaded ===')
  logseq.ready(() => {

    // logseq.provideModel({
    //   show() {
    //     renderApp('logseq')
    //     logseq.showMainUI()
    //   },
    // })
    const commands: IMenu[] = logseq.settings?.menus || []
    commands.forEach(command => {
      logseq.Editor.registerBlockContextMenuItem(`Open in External App: ${command.menuName}`, async e => {
        const block = await logseq.Editor.getBlock(e.uuid)
        const fileRes = new RegExp(command.pathRegExp).exec(block?.content || '')
        if (!fileRes) return logseq.App.showMsg(`Can't find file path in block:\n${block?.content}`, 'error')

        const file = fileRes[1]
        const extension = file?.split('.')?.pop?.()
        if (extension !== command.extensionName) return logseq.App.showMsg(`File extension is not ${command.extensionName}`, 'error')

        // TODO: support multiple apps
        const app = command.apps[0]
        const { path: graphPath } = await logseq.App.getCurrentGraph() || {}
        if (!graphPath) return logseq.App.showMsg('Can\'t open file, no graph is opened')
        const _path = graphPath + '/' + file
        const _url = app.openSchema.replace('{path}', _path)
        window.open(_url, '_blank')
        logseq.App.showMsg(`File ${file} opened in ${app.title}`)
      })
    })
  })
}

// function renderApp(env: string) {
//   ReactDOM.render(
//     <React.StrictMode>
//       <App env={env} />
//     </React.StrictMode>,
//     document.getElementById('root')
//   )
// }
