import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import WPLF from '@libreform/libreform'
import { Form, FormCallback, List } from '@libreform/libreform/dist/types'

const { api, manager } = WPLF

function Loading({ form }: { form: string | number }) {
  return <div>Loading {form}</div>
}

function Errors({ data }: { data: Error }) {
  return (
    <div>
      {data.name}: {data.message}
    </div>
  )
}

function Form({
  data,
  callbacks,
  referrerData,
  html,
}: {
  data: Form
  callbacks?: {
    [x: string]: List<FormCallback>
  }
  referrerData?: ReferrerData
  html: string
}) {
  const { ID, content, fields } = data
  const ref = useRef<HTMLFormElement>(null)
  const encType = Object.values(fields).some((f) => f.type === 'file')
    ? 'multipart/form-data'
    : undefined

  if (!referrerData) {
    referrerData = {
      type: 'react-component',
      url: window.location.href,
    }
  }

  /**
   * After React is done, attach WPLF handlers and do WPLF stuff.
   */
  useLayoutEffect(() => {
    if (ref.current) {
      const el = ref.current
      const refDataEl = el.querySelector<HTMLInputElement>(
        '[name="_referrerData"]'
      )

      if (refDataEl && referrerData) {
        refDataEl.value = JSON.stringify(referrerData)
      }

      const wplfForm = manager.attach(el)

      if (callbacks) {
        Object.entries(callbacks).forEach(([type, list]) => {
          Object.entries(list).forEach(([name, callback]) => {
            wplfForm.addCallback(name, type, callback)
          })
        })
      }

      /**
       * Clean up when unmounting.
       */
      return () => {
        if (callbacks) {
          Object.entries(callbacks).forEach(([type, list]) => {
            Object.entries(list).forEach(([name, callback]) => {
              wplfForm.removeCallback(name, type)
            })
          })
        }

        manager.detach(wplfForm)
      }
    }

    return () => {}
  }, [ref])

  return (
    <form
      className={`wplf-form wplf-form-${ID}`}
      dangerouslySetInnerHTML={{ __html: html }}
      encType={encType}
      ref={ref}
    />
  )
}

interface ReferrerData {
  type: string
  url: string
  id?: number
  title?: string
}

function LibreForm({
  form,

  className,
  ref,
  referrerData,

  WhileLoading = Loading,
  IfErrors = Errors,
  callbacks,
}: {
  form: string | number

  className?: string
  ref?: React.MutableRefObject<HTMLDivElement>
  referrerData?: ReferrerData

  IfErrors?: typeof Errors
  WhileLoading?: typeof Loading

  callbacks?: {
    [x: string]: List<FormCallback>
  }
}) {
  const _ref = useRef<HTMLDivElement>(null)
  const [{ data, html }, setState] = useState<{
    data?: Error | Form
    html: string
  }>({
    data: undefined,
    html: '',
  })

  useEffect(() => {
    async function loadForm(form: string | number) {
      try {
        const response = await api.requestForm(form)
        const { data } = response

        if ('error' in data) {
          setState({
            data: new Error(data.error),
            html: '',
          })
        } else {
          const { raw, rendered } = data.data

          setState({
            data: raw,
            html: rendered,
          })
        }
      } catch (e) {
        setState({
          data: e,
          html: '',
        })
      }
    }

    loadForm(form)
  }, [form])

  const containerRef = ref ? ref : _ref

  let content

  if (data) {
    if (data instanceof Error) {
      content = <IfErrors data={data} />
    } else {
      content = (
        <Form
          data={data}
          html={html}
          callbacks={callbacks}
          referrerData={referrerData}
        />
      )
    }
  } else {
    content = <WhileLoading form={form} />
  }

  return (
    <div className={`react-component ${className}`} ref={containerRef}>
      {content}
    </div>
  )
}

export default LibreForm
