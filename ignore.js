// Примеры собственных паттернов
// build/ — исключить папку build (в любом месте).
// **/*.tmp — исключить все .tmp файлы.
// config/*.json — исключить все .json в config.
// [
//   "node_modules/",
//   "*.log",
//   "!keep.log"       // «!»-паттерн, чтобы разрешить keep.log
// ]

// export const CUSTOM_IGNORE = ['public/', '.git/']
export const CUSTOM_IGNORE = ['public/', 'package-lock.json*', '.git/']
