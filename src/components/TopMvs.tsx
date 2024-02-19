import { getTopMvs } from '@/apis/resources/top';
import useKeyboardEvent from '@/hooks/common/useKeyboardEvent';
import { TrackType } from '@/services/machine/player';
import usePlayer from '@/store/usePlayer';
import { useQuery } from '@tanstack/react-query';
import Swiper from './Swiper';
import Image from './common/Image';
import Typography from './common/Typography';

const TopMvs: React.FC = () => {
  const query = useQuery({
    queryKey: ['top', 'mv'],
    queryFn: () => lastValueFrom(getTopMvs({ limit: 10 })),
    initialData: [],
  });
  const play = usePlayer((state) => state.play);
  const addTrack = usePlayer((state) => state.addTrack);
  const setCurrentPlayTrack = usePlayer((state) => state.setCurrentPlayTrack);

  const onPlay = (id: number) => {
    const track = { id, type: TrackType.mv };

    addTrack(track);
    setCurrentPlayTrack(track);
    play();
  };

  const onKeydown = useKeyboardEvent({
    Enter: {
      callback: (evt) => {
        const target = evt.target as HTMLElement;
        const id = target?.getAttribute('data-id');
        if (id) {
          onPlay(+id);
        }
      },
    },
  });

  return (
    <Swiper
      source={query.data}
      sourceKey='id'
      container={{
        slidesPerView: 3.5,
        spaceBetween: 10,
        slidesOffsetBefore: 10,
      }}
    >
      {({ id, name, cover }) => (
        <div>
          <Image className='overflow-hidden rounded' src={cover} />
          <div
            className='cursor-pointer truncate'
            role='button'
            data-id={id}
            onClick={() => onPlay(id)}
            onKeyDown={onKeydown}
            tabIndex={0}
          >
            <Typography.Text>{name}</Typography.Text>
          </div>
        </div>
      )}
    </Swiper>
  );
};

export default TopMvs;
