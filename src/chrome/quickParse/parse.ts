import { errorText } from './errorText'
import { evaluateConditions } from './evaluateConditions'
import { getNextPath } from './getNextPath'
import { getNode } from './getNode'
import { getNodeContent } from './getNodeContent'
import { isIterablePath } from './isIterablePath'
import { isListConfig, Config, ListConfig, SingleNodeConfig } from './model'

const setNestedProperty = (obj: Record<string, any>, path: string[], value: any) => {
  if (!path.length || !obj) return
  const [key, ...restPath] = path
  if (!restPath.length) {
    obj[key] = value
  } else {
    obj[key] = {}
    setNestedProperty(obj[key], restPath, value)
  }
}

const getConfig = (
  config: Config,
  container: Node | null = document
): { config: ListConfig | SingleNodeConfig; container: Node | null } | null => {
  const next = evaluateConditions(config, container)
  if (!next) {
    console.error(`No valid conditions for field ${config.fieldname}`)
    return null
  }

  return next
}

export const parse = (config: Config[]) => {
  const singleNodeConfigParser = (config: SingleNodeConfig, container: Node = document) => {
    const node = getNode(config.xpath, container)

    return config.childNodes ? parser(config.childNodes, node) : getNodeContent(node)
  }

  const listConfigParser = (config: ListConfig, container: Node = document) => {
    if (!isIterablePath(config.xpath)) {
      return errorText('Invalid xpath format for list element')
    }
    const result: any[] = []
    let i = 1
    let nextPath = getNextPath(config.xpath, i)
    let nextNode = getNode(nextPath, container)

    while (nextNode) {
      const val = config.childNodes ? parser(config.childNodes, nextNode) : getNodeContent(nextNode)
      result.push(val)
      i += 1
      nextPath = getNextPath(config.xpath, i)
      nextNode = getNode(nextPath, container)
    }

    return result
  }

  function parser(config: Config[], container: Node | null = document) {
    return config.reduce((acc, cur) => {
      const config = getConfig(cur, container)

      config &&
        container &&
        setNestedProperty(
          acc,
          [config.config.fieldname],
          isListConfig(config.config)
            ? listConfigParser(config.config, config.container || container)
            : singleNodeConfigParser(config.config, config.container || container)
        )

      return acc
    }, {} as Record<string, any>)
  }

  return parser(config)
}
