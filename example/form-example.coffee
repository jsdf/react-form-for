Form = React.createClass
  handleChange: (updatedValue) ->
    @setState value: updatedValue
  render: ->
    FormFor @state.value, onChange: @handleChange, (f) ->
      <form>
        <f.Field for="name" />
        <f.Field for="from_date" />
        <f.Field for="to_date" />
        {f.FieldsFor "related", (fr) ->
          <div>
            <fr.Field for="something" />
          </div>
        }
      </form>
