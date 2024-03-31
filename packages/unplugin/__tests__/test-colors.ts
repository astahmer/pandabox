import type { ElementHandle, Locator, Page } from '@playwright/test'

async function getEl(page: Page, el: string | ElementHandle | Locator): Promise<ElementHandle> {
  if (typeof el === 'string') {
    const realEl = await page.$(el)
    if (realEl == null) {
      throw new Error(`Cannot find element: "${el}"`)
    }
    return realEl
  }
  if ('elementHandle' in el) {
    return el.elementHandle() as Promise<ElementHandle>
  }

  return el
}

export async function getElementStyle(page: Page, el: string | ElementHandle | Locator): Promise<CSSStyleDeclaration> {
  el = await getEl(page, el)
  return el.evaluate((el) => getComputedStyle(el as Element))
}

export const getClassName = async (page: Page, el: string | ElementHandle | Locator): Promise<string> => {
  el = await getEl(page, el)
  return el.evaluate((el) => (el as Element).className)
}
