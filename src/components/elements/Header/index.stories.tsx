import React from 'react'
import Header from './Header'
import mockMenuItems from './__fixtures__/menuItem.json'

jest.mock('./NavMenu', () => 'NavMenu')

export default {
  title: 'Example/Header',
  component: Header,
}

const Template = () => <Header />

export const Default = Template.bind({})
