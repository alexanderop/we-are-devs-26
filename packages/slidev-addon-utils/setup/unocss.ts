import { defineConfig, presetIcons } from 'unocss'
import { getAllIconClasses } from '../utils/parseFileTree'
import { IDEALS } from '../constants/ideals'

export default () => defineConfig({
  safelist: [
    ...getAllIconClasses(),
    ...IDEALS.map(i => i.icon),
  ],
  presets: [
    presetIcons(),
  ],
})
