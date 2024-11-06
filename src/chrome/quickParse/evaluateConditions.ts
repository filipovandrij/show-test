import { isNotNil } from '../../utils/isNotNil'
import { isString } from '../../utils/isString'
import { getNextPath } from './getNextPath'
import { getNode } from './getNode'
import { getNodeContent } from './getNodeContent'
import { isIterablePath } from './isIterablePath'
import { Config, ListConfig, Operation, SingleNodeConfig } from './model'

const operations: {
  [k in Operation]: (nodeContent: string | null | undefined, value?: string) => boolean
} = {
  not_like: (nodeContent, value) =>
    isString(value) &&
    isString(nodeContent) &&
    !nodeContent.toLowerCase().includes(value.toLowerCase()),
  like: (nodeContent, value) =>
    isString(value) &&
    isString(nodeContent) &&
    nodeContent.toLowerCase().includes(value.toLowerCase()),
  regexp: (nodeContent, value) =>
    isString(value) && isString(nodeContent) && new RegExp(value, 'u').test(nodeContent),
  not_nil: (nodeContent) => isNotNil(nodeContent),
}

export const evaluateConditions = (
  config: Config,
  container: Node | null = document
): { config: ListConfig | SingleNodeConfig; container: Node | null } | null => {
  const { conditions, xpath } = config

  if (conditions === undefined) return { config, container }

  if (config.iterableCheckConditions) {
    if (!isIterablePath(xpath)) {
      console.error('Invalid iterable conditon path format')
      return null
    }
    let i = 1
    let nextPath = getNextPath(config.xpath, i)
    let nextNode = getNode(nextPath, container)

    while (nextNode) {
      const condition = conditions.find(({ operation, value, containerType, xpath }) => {
        const node = getNode(xpath, containerType === 'document' ? document : nextNode)
        const nodeContent = getNodeContent(node)

        return operations[operation](nodeContent, value)
      })
      if (condition) {
        return evaluateConditions(
          condition.next,
          condition.containerType === 'document' ? document : nextNode
        )
      }
      i += 1
      nextPath = getNextPath(config.xpath, i)
      nextNode = getNode(nextPath, container)
    }

    return null
  }

  const nextNode = getNode(config.xpath, container)
  const condition = conditions.find(({ operation, value, containerType, xpath }) => {
    const node = getNode(xpath, containerType === 'document' ? document : nextNode)
    const nodeContent = getNodeContent(node)

    return operations[operation](nodeContent, value)
  })

  return condition
    ? evaluateConditions(
        condition.next,
        condition.containerType === 'document' ? document : nextNode
      )
    : null
}
