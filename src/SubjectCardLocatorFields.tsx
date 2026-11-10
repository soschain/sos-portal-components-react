'use client'

export type SubjectCardLocatorValue=Readonly<{
  method:'card-number'|'did-qr'
  subjectKind:''|'person'|'animal'
  taxonomyId:string
  locator:string
}>
export type SubjectCardLocatorCopy=Readonly<{
  method:string;number:string;didQr:string;subjectKind:string;choose:string
  person:string;animal:string;species:string;taxonomy:string;otherSpecies:string;value:string
}>
export type SubjectCardLocatorFieldsProps=Readonly<{
  copy:SubjectCardLocatorCopy
  value:SubjectCardLocatorValue
  speciesOptions:readonly Readonly<{taxonomyId:string;label:string}>[]
  disabled?:boolean
  onChange(value:SubjectCardLocatorValue):void
}>

/** Controlled identification fields shared by portal modes; the host resolves and authorizes. */
export function SubjectCardLocatorFields({copy,value,speciesOptions,disabled,onChange}:SubjectCardLocatorFieldsProps){
  const animalNumber=value.method==='card-number'&&value.subjectKind==='animal'
  const otherSpecies=Boolean(value.taxonomyId)&&!speciesOptions.some(option=>option.taxonomyId===value.taxonomyId)
  return <div className="subject-card-locator-fields">
    <label>{copy.method}<select disabled={disabled} value={value.method} onChange={event=>onChange({...value,method:event.currentTarget.value as SubjectCardLocatorValue['method'],subjectKind:'',taxonomyId:''})}>
      <option value="card-number">{copy.number}</option><option value="did-qr">{copy.didQr}</option>
    </select></label>
    {value.method==='card-number'?<label>{copy.subjectKind}<select disabled={disabled} value={value.subjectKind} onChange={event=>onChange({...value,subjectKind:event.currentTarget.value as SubjectCardLocatorValue['subjectKind'],taxonomyId:''})}>
      <option value="">{copy.choose}</option><option value="person">{copy.person}</option><option value="animal">{copy.animal}</option>
    </select></label>:null}
    {animalNumber?<>
      <label>{copy.species}<select disabled={disabled} value={otherSpecies?'other':value.taxonomyId} onChange={event=>onChange({...value,taxonomyId:event.currentTarget.value})}>
        <option value="">{copy.choose}</option>
        {speciesOptions.map(option=><option key={option.taxonomyId} value={option.taxonomyId}>{option.label}</option>)}
        <option value="other">{copy.otherSpecies}</option>
      </select></label>
      {otherSpecies?<label>{copy.taxonomy}<input disabled={disabled} inputMode="numeric" value={value.taxonomyId==='other'?'':value.taxonomyId} onChange={event=>onChange({...value,taxonomyId:event.currentTarget.value||'other'})}/></label>:null}
    </>:null}
    <label>{copy.value}<input disabled={disabled} autoComplete="off" inputMode={value.method==='card-number'?'numeric':'text'} value={value.locator} onChange={event=>onChange({...value,locator:event.currentTarget.value})}/></label>
  </div>
}
