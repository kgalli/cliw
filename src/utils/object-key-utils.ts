function isArray(arr: any): boolean {
  return Array.isArray(arr)
}

function isObject(o: any): boolean {
  // eslint-disable-next-line no-new-object
  return o === new Object(o) && !isArray(o) && typeof o !== 'function'
}

function snakeCaseToCamelCase(value: string) {
  return value.replace(/(_\w)/g, function (m) {
    return m[1].toUpperCase()
  })
}

function camelCaseToSnakeCase(value: string) {
  return value.replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + '_' + m[1]
  }).toLowerCase()
}

type TransFormFunc = (value: string) => string

function transformKeys(o: any, transformFunc: TransFormFunc, keysToSkipForCaseTransformation: Set<string>): any {
  if (isObject(o)) {
    const n: any = {}

    Object.keys(o)
    .forEach(key => {
      if (keysToSkipForCaseTransformation.has(key)) {
        n[key] = o[key]
      } else {
        n[transformFunc(key)] = transformKeys(o[key], transformFunc, keysToSkipForCaseTransformation)
      }
    })

    return n
  }

  if (isArray(o)) {
    return o.map((item: any) => transformKeys(item, transformFunc, keysToSkipForCaseTransformation))
  }

  return o
}

export function toCamelCase(o: any, keysToSkipForCaseTransformation: Set<string> = new Set<string>()) {
  return transformKeys(o, snakeCaseToCamelCase, keysToSkipForCaseTransformation)
}

export function toSnakeCase(o: any, keysToSkipForCaseTransformation: Set<string> = new Set<string>()) {
  return transformKeys(o, camelCaseToSnakeCase, keysToSkipForCaseTransformation)
}
