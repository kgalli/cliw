function isArray(arr: any): boolean {
  return Array.isArray(arr)
}

function isObject(o: any): boolean {
  return o === Object(o) && !isArray(o) && typeof o !== 'function'
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

function transformKeys(o: any, transformFunc: TransFormFunc): any {
  if (isObject(o)) {
    const n: any = {}

    Object.keys(o)
      .forEach(key => {
        n[transformFunc(key)] = transformKeys(o[key], transformFunc)
      })

    return n
  } else if (isArray(o)) {
    return o.map((item: any) => transformKeys(item, transformFunc))
  }

  return o
}

export function toCamelCase(o: any) {
  return transformKeys(o, snakeCaseToCamelCase)
}

export function toSnakeCase(o: any) {
  return transformKeys(o, camelCaseToSnakeCase)
}
