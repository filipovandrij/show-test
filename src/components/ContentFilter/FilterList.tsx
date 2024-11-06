import { ListItemText, List, ListItem, ListSubheader } from '@mui/material'
import { styled } from '@mui/system'
import { TFilter } from '../../chrome/linkedinSearch/LinkedinSearchFilter'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
`

type Props = {
  filters: TFilter[]
}

const FilterList = ({ filters }: Props) => {
  return (
    <Container>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          maxHeight: 300,
          '& ul': { padding: 0 },
        }}
        subheader={<li />}
      >
        {filters.map((filter: any) => (
          <li key={`section-${filter.filterId}`}>
            <ul>
              <ListSubheader
                sx={{
                  fontFamily: 'Axiforma',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                {filter.filterId.length > 23
                  ? `${filter.filterId.slice(0, 23)}...`
                  : filter.filterId}
              </ListSubheader>
              {filter.FilterParameters.map((item: string) => (
                <ListItem key={`item-${filter}-${item}`}>
                  <ListItemText
                    sx={{
                      fontFamily: 'Axiforma',
                      fontWeight: '500',
                      fontSize: '14px',
                    }}
                    primary={item}
                  />
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
    </Container>
  )
}

export default FilterList
