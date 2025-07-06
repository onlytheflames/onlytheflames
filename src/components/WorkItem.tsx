interface WorkItemProps {
  title: string;
  description: string;
}

const WorkItem = ({ title, description }: WorkItemProps) => {
  return (
    <div className="flex px-4 md:px-12 xl:px-24 flex-wrap justify-between items-center">
      <p className="uppercase font-semibold text-4xl md:text-8xl">{title}</p>
      <p className="text-wrap">{description}</p>
    </div>
  );
};

export default WorkItem;
