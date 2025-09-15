Quero gerar arquivos que correspondam a cards (issues) para alimentar um kanban. Utilizaremos a mesma estrutura do `rapida-v.json`, criaremos os arquivos `/Users/opah/Code/personal/kunlatek/rapida/rapida-v/src/templates/kanban/issue.template.ejs `e `/Users/opah/Code/personal/kunlatek/rapida/rapida-v/src/generators/kanban.generator.ts` , acrescentaremos ao `rapida-partner-schemas.json` um atributo `userStory` que se relacionará ao `component`, que servirá para montarmos os arquivos cards comentados. neste arquivo/card teremos:

1 - o nome da pasta que criará os cards para as tarefas de backenbd será a combinação de `kanban-backend-<project-title>`

2 - o nome da pasta que criará os cards para as tarefas de frontend será a combinação de `kanban-frontend-<project-title>`

2.1 - Cada card/issue (arquivo) corresponderá a um component, será escrito em formato .md, e daremos o nome do arquivo a partir de <project.modules[n].components[n].id>.md

2.1.1 - O título do card será <project.modules[n].components[n].title> (estilize com md o título)

2.1.2 - A "Estória de usuário" virá de <project.modules[n].components[n].userStory> (não obrigatório)

2.1.3 - Os elementos serão listados como um checklist (em md) e organizado da seguinte maneira: <project.modules[n].components[n].elements[n]>
2.1.3.1 - Cada atributo do elemenot também deve ser listado como um "sub checklist" (em md) do elemento
