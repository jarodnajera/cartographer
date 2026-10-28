// @vitest-environment happy-dom
import { expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../src/App.vue'
import { router } from '../src/router'
vi.stubGlobal('scrollTo',vi.fn())
HTMLDialogElement.prototype.showModal=function(){this.open=true}
HTMLDialogElement.prototype.close=function(){this.open=false}
it('boots without configuration and opens an explicitly labeled sample workspace',async()=>{
  await router.push('/today');await router.isReady()
  const wrapper=mount(App,{global:{plugins:[router]}})
  await flushPromises();expect(wrapper.text()).toContain('Account setup is pending')
  const explore=wrapper.findAll('button').find(b=>b.text()==='Explore sample workspace')!
  await explore.trigger('click');await flushPromises()
  expect(wrapper.text()).toContain('Sample workspace.');expect(wrapper.find('h1').text()).toBe('Today')
  expect(wrapper.text()).toContain('Follow up on homepage feedback')
  await router.push('/projects/p3');await flushPromises()
  expect(wrapper.findAll('nav a').find(a=>a.text().includes('Projects'))!.classes()).toContain('router-link-active')
  expect(wrapper.text()).toContain('Editorial identity');expect(wrapper.text()).toContain('Unresolved task follow-ups and unpaid invoices keep their own reminders')
  await router.push('/settings');await flushPromises()
  await wrapper.findAll('button').find(b=>b.text()==='Delete account')!.trigger('click');await flushPromises()
  await wrapper.get('input[type="password"]').setValue('wrong')
  await wrapper.get('dialog input[type="checkbox"]').setValue(true)
  await wrapper.get('dialog form').trigger('submit');await flushPromises()
  expect(wrapper.text()).toContain('For the sample, enter demo')
  await wrapper.get('input[type="password"]').setValue('demo')
  await wrapper.get('dialog form').trigger('submit');await flushPromises()
  expect(wrapper.find('h1').text()).toBe('Sample deletion started.')
  expect(wrapper.text()).toContain('No real account or saved records were removed')
  wrapper.unmount()
})
