import TopMvs from '@/components/TopMvs';
import Typography from '@/components/common/Typography';

const TopView: React.FC = () => (
  <div>
    <Typography.Title>热门歌曲排行</Typography.Title>
    <Typography.Title>热门歌单排行</Typography.Title>

    <div className='flex flex-col gap-1'>
      <Typography.Title>热门视频排行</Typography.Title>
      <div>
        <TopMvs />
      </div>
    </div>
  </div>
);

export default TopView;
