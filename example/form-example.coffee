Form = React.createClass
  handleChange: (updatedValue) -> @setState value: updatedValue
  render: ->
    FormFor @state.value, onChange: @handleChange, (f) ->
      <form>
        <Field for="name" />
        <Field for="from_date" />
        <Field for="to_date" />
        {f.FieldsFor "related", (f2) ->
          <div>
            <Field for="something" />
          </div>
        }
      </form>
