const applicationShow = ({ application }: { application: any }): void => {
  console.log(`Showing application ${application.name}`)
  application.features.forEach((feature: any) => {
    console.log(feature.name)
    feature.criterias.forEach((criteria: any) => {
      console.log(`  ${criteria.name}: [${criteria.values.join(', ')}]`)
    })
  })
}

const toggleEvaluate = ({ application, toggle }: { application: string, toggle: any}): void => {
  console.log(`Showing toggles ${application}`)
  toggle.forEach(({ name, isActive }: { name: string, isActive: boolean }) => {
    console.log(`${name}\t${isActive ? 'ON' : 'OFF'}`)
  })
}

export { applicationShow, toggleEvaluate }
